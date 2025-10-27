import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const data = await prisma.kelebihan_kekurangan.findMany({
      orderBy: { id: "asc" },
      include: { kelebihan_kekurangan_detail: true },
    });

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data Kelebihan/Kekurangan ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error mengambil data Kelebihan/Kekurangan:", error);
    return NextResponse.json(
      { error: "Gagal memuat data Kelebihan/Kekurangan" },
      { status: 500 }
    );
  }
}
