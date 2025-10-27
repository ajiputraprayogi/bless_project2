import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ Ambil detail step payment by ID (Termasuk detailnya)
export async function GET(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const paymentStep = await prisma.payment_step.findUnique({
      where: { id },
      select: {
        id: true,
        step_number: true,
        title: true,
        createdat: true,
        updatedat: true,
        payment_step_detail: {
          select: {
            id: true, // WAJIB ADA untuk identifikasi di sisi client/update
            sub_title: true,
            description: true,
          },
          orderBy: {
            id: 'asc', 
          }
        },
      },
    });

    if (!paymentStep) {
      return NextResponse.json(
        { error: "Data step payment tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(paymentStep, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET Step Payment by ID):", error);
    return NextResponse.json(
      { error: "Gagal mengambil data step payment" },
      { status: 500 }
    );
  }
}

// ✅ Update payment_step dan payment_step_detail (Menggunakan Nested Writes/Transaksi)
export async function PUT(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    // Menerima step_number, title, dan array detail dari client
    const { step_number, title, details } = await req.json();

    const existingStep = await prisma.payment_step.findUnique({
      where: { id },
      include: { payment_step_detail: true },
    });

    if (!existingStep) {
      return NextResponse.json({ error: "Step payment tidak ditemukan" }, { status: 404 });
    }

    // 1. Identifikasi detail yang sudah ada dan yang baru masuk
    const existingDetailIds = existingStep.payment_step_detail.map(d => d.id);
    const incomingDetailIds = details.filter(d => d.id).map(d => d.id);

    // 2. Tentukan operasi CRUD untuk detail
    const detailsToDelete = existingDetailIds.filter(detailId => !incomingDetailIds.includes(detailId));
    const detailsToUpdate = details.filter(d => d.id);
    const detailsToCreate = details.filter(d => !d.id);

    // 3. Bangun array operasi transaksi Prisma
    const transactionOperations = [
      // DELETE: Hapus detail yang ada di DB tapi tidak dikirim client
      ...detailsToDelete.map(detailId => prisma.payment_step_detail.delete({
        where: { id: detailId },
      })),

      // UPDATE: Perbarui detail yang dikirim client dan punya ID
      ...detailsToUpdate.map(detail => prisma.payment_step_detail.update({
        where: { id: detail.id },
        data: {
          sub_title: detail.sub_title,
          description: detail.description,
        },
      })),

      // CREATE: Buat detail baru yang dikirim client dan tidak punya ID
      ...detailsToCreate.map(detail => prisma.payment_step_detail.create({
        data: {
          sub_title: detail.sub_title,
          description: detail.description,
          payment_step_id: id,
        },
      })),

      // UPDATE STEP: Perbarui data payment_step utama
      prisma.payment_step.update({
        where: { id },
        data: {
          step_number: step_number,
          title: title,
          updatedat: new Date(),
        },
      }),
    ];

    // Jalankan semua operasi dalam satu transaksi
    await prisma.$transaction(transactionOperations);

    return NextResponse.json({ message: "Step payment berhasil diperbarui" }, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT Step Payment with nested writes):", error);
    return NextResponse.json(
      { error: "Gagal memperbarui step payment. Pastikan semua data detail diisi dan ID valid." },
      { status: 500 }
    );
  }
}

// ✅ Hapus payment_step (dengan cascade delete detail terkait)
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.payment_step.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Data step payment tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.payment_step.delete({ where: { id } });

    return NextResponse.json(
      { message: "Step payment berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma error (DELETE Step Payment):", error);
    return NextResponse.json(
      { error: "Gagal menghapus step payment" },
      { status: 500 }
    );
  }
}