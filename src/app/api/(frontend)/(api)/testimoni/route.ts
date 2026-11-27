import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const testimoni = await cachedPublicQuery(
      ["public-testimoni"],
      "testimoni",
      async () =>
        prisma.testimoni.findMany({
          select: {
            id: true,
            client: true,
            message: true,
            alt: true,
            video: true,
            avatar: true,
            src: true,
          },
          orderBy: { id: "desc" },
        })
    );

    if (!testimoni || testimoni.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data Testimoni ditemukan" },
        { status: 404 }
      );
    }

    return publicJsonResponse(testimoni, 200);
  } catch (error) {
    console.error("Error mengambil data Testimoni:", error);
    return NextResponse.json(
      { error: "Gagal memuat data Testimoni" },
      { status: 500 }
    );
  }
}