import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ GET: ambil semua data Kelebihan & Kekurangan beserta detail
export async function GET() {
  try {
    const data = await prisma.kelebihan_kekurangan.findMany({
      select: {
        id: true,
        judul: true,
        type: true,
        kelebihan_kekurangan_detail: {
          select: {
            id: true,
            detail: true,
          },
          orderBy: { id: "asc" }, // biar detail rapi sesuai urutan input
        },
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ Prisma error (GET kelebihan_kekurangan):", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Kelebihan/Kekurangan" },
      { status: 500 }
    );
  }
}

// ✅ POST: buat data baru Kelebihan / Kekurangan
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { judul, type, details } = body;

    // Validasi sederhana
    if (!judul || typeof judul !== "string" || judul.trim() === "") {
      return NextResponse.json(
        { error: "Judul wajib diisi" },
        { status: 400 }
      );
    }
    if (!["kelebihan", "kekurangan"].includes(type)) {
      return NextResponse.json(
        { error: "Type harus 'kelebihan' atau 'kekurangan'" },
        { status: 400 }
      );
    }

    const newData = await prisma.kelebihan_kekurangan.create({
      data: {
        judul: judul.trim(),
        type,
        kelebihan_kekurangan_detail: {
          create: Array.isArray(details)
            ? details
                .filter((d) => typeof d === "string" && d.trim() !== "")
                .map((d) => ({ detail: d.trim() }))
            : [],
        },
      },
      include: {
        kelebihan_kekurangan_detail: true,
      },
    });

    return NextResponse.json(newData, { status: 201 });
  } catch (error) {
    console.error("❌ Prisma error (POST kelebihan_kekurangan):", error);
    return NextResponse.json(
      { error: "Gagal menambahkan data Kelebihan/Kekurangan" },
      { status: 500 }
    );
  }
}
