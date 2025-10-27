import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ Ambil detail FAQ by ID
export async function GET(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const faq = await prisma.faq.findUnique({
      where: { id },
      select: {
        id: true,
        question: true,
        answer: true,
        sortOrder: true,
      },
    });

    if (!faq) {
      return NextResponse.json(
        { error: "Data FAQ tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(faq, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET FAQ by ID):", error);
    return NextResponse.json(
      { error: "Gagal mengambil data FAQ" },
      { status: 500 }
    );
  }
}

// ✅ Update FAQ
export async function PUT(req, context) {
  try {
    const { params } = await context;
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();
    const { question, answer, sortOrder } = body;

    const existing = await prisma.faq.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Data FAQ tidak ditemukan" },
        { status: 404 }
      );
    }

    const updated = await prisma.faq.update({
      where: { id },
      data: {
        question: question ?? existing.question,
        answer: answer ?? existing.answer,
        sortOrder: sortOrder ?? existing.sortOrder,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT FAQ):", error);
    return NextResponse.json(
      { error: "Gagal update data FAQ" },
      { status: 500 }
    );
  }
}

// ✅ Hapus FAQ
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.faq.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Data FAQ tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.faq.delete({ where: { id } });

    return NextResponse.json(
      { message: "FAQ berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma error (DELETE FAQ):", error);
    return NextResponse.json(
      { error: "Gagal menghapus FAQ" },
      { status: 500 }
    );
  }
}
