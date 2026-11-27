// src/app/(frontend)/api/banner/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const banners = await cachedPublicQuery(["public-banner"], "banner", async () => {
      const dbBanner = await prisma.banner.findMany({
        select: {
          id: true,
          image: true,
          is_active: true,
        },
        orderBy: { created_at: "desc" },
      });

      return dbBanner.map((banner) => ({
        id: banner.id,
        img: banner.image ?? "/images/default-banner.jpg",
        active: banner.is_active,
      }));
    });

    return publicJsonResponse(banners);
  } catch (error) {
    console.error("Error mengambil data banner:", error);
    return NextResponse.json(
      { error: "Gagal memuat data banner" },
      { status: 500 }
    );
  }
}
