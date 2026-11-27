// src/app/(frontend)/api/kontak/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const kontakFormatted = await cachedPublicQuery(
      ["public-kontak"],
      "kontak",
      async () => {
        const dbKontak = await prisma.kontak.findMany({
          where: { is_active: true },
          select: {
            id: true,
            platform: true,
            url: true,
            icon: true,
          },
          orderBy: { order: "asc" },
        });

        return dbKontak.map((k) => ({
          id: k.id,
          platform: k.platform,
          url: k.url,
          icon: k.icon || "link",
        }));
      }
    );

    return publicJsonResponse(kontakFormatted);
  } catch (error) {
    console.error("Error mengambil data kontak:", error);
    return NextResponse.json(
      { error: "Gagal memuat data kontak" },
      { status: 500 }
    );
  }
}
