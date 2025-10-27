import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ Ambil detail chat by ID
export async function GET(req, context) {
  try {
    const { params } = await context;
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const chat = await prisma.chat.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        discount: true,
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Data chat tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET Chat by ID):", error);
    return NextResponse.json(
      { error: "Gagal mengambil data chat" },
      { status: 500 }
    );
  }
}

// ✅ Update chat
export async function PUT(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();
    const { title, description, discount } = body;

    const existing = await prisma.chat.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Data chat tidak ditemukan" },
        { status: 404 }
      );
    }

    const updated = await prisma.chat.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        description: description ?? existing.description,
        discount: discount ?? existing.discount,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT Chat):", error);
    return NextResponse.json(
      { error: "Gagal update data chat" },
      { status: 500 }
    );
  }
}

// ✅ Hapus chat
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.chat.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Data chat tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.chat.delete({ where: { id } });

    return NextResponse.json(
      { message: "Chat berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma error (DELETE Chat):", error);
    return NextResponse.json(
      { error: "Gagal menghapus chat" },
      { status: 500 }
    );
  }
}
