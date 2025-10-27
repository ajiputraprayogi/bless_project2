import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ Ambil detail Paket by ID
export async function GET(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const paket = await prisma.paket.findUnique({
      where: { id },
      include: { fitur: true }, // ambil fitur
    });

    if (!paket) {
      return NextResponse.json(
        { error: "Data Paket tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(paket, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET Paket by ID):", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Paket" },
      { status: 500 }
    );
  }
}

// ✅ Update Paket
export async function PUT(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();
    const { name, harga, fitur } = body;

    const existing = await prisma.paket.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Data Paket tidak ditemukan" },
        { status: 404 }
      );
    }

    const updated = await prisma.paket.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        harga: harga ?? existing.harga,
        fitur: {
          deleteMany: {}, // hapus fitur lama
          create: Array.isArray(fitur)
            ? fitur.filter((f) => f.trim() !== "").map((f) => ({ fitur: f }))
            : [],
        },
      },
      include: { fitur: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT Paket):", error);
    return NextResponse.json(
      { error: "Gagal update data Paket" },
      { status: 500 }
    );
  }
}

// ✅ Hapus Paket
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.paket.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Data Paket tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.paket.delete({ where: { id } });

    return NextResponse.json(
      { message: "Paket berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma error (DELETE Paket):", error);
    return NextResponse.json(
      { error: "Gagal menghapus Paket" },
      { status: 500 }
    );
  }
}
