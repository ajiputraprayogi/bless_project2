import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ======================================================
// GET BY ID
// ======================================================
export async function GET(req, context) {
  try {
    const { id } = context.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: "ID tidak valid" },
        { status: 400 }
      );
    }

    const testimoni = await prisma.dummy_testi.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        client: true,
        message: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!testimoni) {
      return NextResponse.json(
        { error: "Data dummy testimoni tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimoni, { status: 200 });

  } catch (error) {
    console.error("GET dummy_testi error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dummy testimoni" },
      { status: 500 }
    );
  }
}

// ======================================================
// PATCH (UPDATE)
// ======================================================
export async function PATCH(req, context) {
  try {
    const { id } = context.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: "ID tidak valid" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { client, message } = body;

    const existing = await prisma.dummy_testi.findUnique({
      where: { id: numericId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data dummy testimoni tidak ditemukan" },
        { status: 404 }
      );
    }

    const newClient = client ?? existing.client;
    const newMessage = message ?? existing.message;

    if (!newClient || !newMessage) {
      return NextResponse.json(
        { error: "Client dan message wajib diisi" },
        { status: 400 }
      );
    }

    const updated = await prisma.dummy_testi.update({
      where: { id: numericId },
      data: {
        client: newClient,
        message: newMessage,
      },
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error("PATCH dummy_testi error:", error);
    return NextResponse.json(
      { error: "Gagal update dummy testimoni" },
      { status: 500 }
    );
  }
}

// ======================================================
// DELETE
// ======================================================
export async function DELETE(req, context) {
  try {
    const { id } = context.params;
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: "ID tidak valid" },
        { status: 400 }
      );
    }

    const existing = await prisma.dummy_testi.findUnique({
      where: { id: numericId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data dummy testimoni tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.dummy_testi.delete({
      where: { id: numericId },
    });

    return NextResponse.json(
      { message: "Dummy testimoni berhasil dihapus" },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE dummy_testi error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus dummy testimoni" },
      { status: 500 }
    );
  }
}
