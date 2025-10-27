import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // ✅ Ambil semua Paket, termasuk fitur, urutkan berdasarkan ID ASC
    const pakets = await prisma.paket.findMany({
      orderBy: { id: "asc" },
      include: { fitur: true }, // ambil fitur terkait
    });

    if (!pakets || pakets.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data Paket ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(pakets, { status: 200 });
  } catch (error) {
    console.error("Error mengambil data Paket:", error);
    return NextResponse.json(
      { error: "Gagal memuat data Paket" },
      { status: 500 }
    );
  }
}
