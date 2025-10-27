import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req) {
  try {
    // Ambil id dari URL
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split("/").pop(), 10); // ambil [id] dari path

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const kk = await prisma.kelebihan_kekurangan.findUnique({
      where: { id },
      include: { kelebihan_kekurangan_detail: true },
    });

    if (!kk) {
      return NextResponse.json(
        { error: "Data Kelebihan/Kekurangan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(kk, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET KK by ID):", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Kelebihan/Kekurangan" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split("/").pop(), 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();
    const { judul, type, detail } = body;

    const existing = await prisma.kelebihan_kekurangan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.kelebihan_kekurangan.update({
      where: { id },
      data: {
        judul: judul ?? existing.judul,
        type: type ?? existing.type,
        kelebihan_kekurangan_detail: {
          deleteMany: {},
          create: Array.isArray(detail)
            ? detail.filter(d => d.trim() !== "").map(d => ({ detail: d }))
            : [],
        },
      },
      include: { kelebihan_kekurangan_detail: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT KK):", error);
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split("/").pop(), 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.kelebihan_kekurangan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    await prisma.kelebihan_kekurangan.delete({ where: { id } });

    return NextResponse.json({ message: "Data berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Prisma error (DELETE KK):", error);
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
