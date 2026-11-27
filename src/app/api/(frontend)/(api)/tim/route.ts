// src/app/(frontend)/dummyapi/tim/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sizePattern } from "@/utils/size";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const teamWithSize = await cachedPublicQuery(["public-tim"], "tim", async () => {
      const dbTim = await prisma.tim.findMany({
        select: {
          id: true,
          nama: true,
          posisi: true,
          image: true,
        },
        orderBy: { created_at: "desc" },
      });

      return dbTim.map((member, idx) => ({
        id: member.id,
        title: member.nama,
        desc: member.posisi,
        img: member.image ?? "/images/default-image.jpg",
        size: sizePattern[idx % sizePattern.length],
      }));
    });

    return publicJsonResponse(teamWithSize);
  } catch (error) {
    console.error("Error mengambil data tim:", error);
    return NextResponse.json(
      { error: "Gagal memuat data tim" },
      { status: 500 }
    );
  }
}