import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const pakets = await cachedPublicQuery(["public-paket"], "paket", async () =>
      prisma.paket.findMany({
        orderBy: { id: "asc" },
        include: { fitur: true },
      })
    );

    if (!pakets || pakets.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data Paket ditemukan" },
        { status: 404 }
      );
    }

    return publicJsonResponse(pakets, 200);
  } catch (error) {
    console.error("Error mengambil data Paket:", error);
    return NextResponse.json(
      { error: "Gagal memuat data Paket" },
      { status: 500 }
    );
  }
}
