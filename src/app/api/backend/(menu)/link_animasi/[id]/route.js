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

    const animasi = await prisma.link_animasi.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        link: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!animasi) {
      return NextResponse.json(
        { error: "Data link animasi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(animasi, { status: 200 });

  } catch (error) {
    console.error("GET link_animasi error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data link animasi" },
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
    const { link } = body;

    const existing = await prisma.link_animasi.findUnique({
      where: { id: numericId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data link animasi tidak ditemukan" },
        { status: 404 }
      );
    }

    const newLink = link ?? existing.link;

    if (!newLink) {
      return NextResponse.json(
        { error: "Link animasi wajib diisi" },
        { status: 400 }
      );
    }

    const updated = await prisma.link_animasi.update({
      where: { id: numericId },
      data: {
        link: newLink,
      },
    });

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error("PATCH link_animasi error:", error);
    return NextResponse.json(
      { error: "Gagal update link animasi" },
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

    const existing = await prisma.link_animasi.findUnique({
      where: { id: numericId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data link animasi tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.link_animasi.delete({
      where: { id: numericId },
    });

    return NextResponse.json(
      { message: "Link animasi berhasil dihapus" },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE link_animasi error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus link animasi" },
      { status: 500 }
    );
  }
}
