import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const data = await cachedPublicQuery(
      ["public-dummytesti"],
      "dummytesti",
      async () =>
        prisma.dummy_testi.findMany({
          select: {
            id: true,
            client: true,
            message: true,
            created_at: true,
          },
          orderBy: {
            id: "desc",
          },
        })
    );

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data Dummy Testimoni ditemukan" },
        { status: 404 }
      );
    }

    return publicJsonResponse(data, 200);
  } catch (error) {
    console.error("GET dummy_testi error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data Dummy Testimoni" },
      { status: 500 }
    );
  }
}
