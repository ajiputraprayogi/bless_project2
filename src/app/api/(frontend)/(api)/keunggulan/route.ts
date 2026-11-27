import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

type KeunggulanOutput = {
  id: number;
  slug: string;
  title: string;
  desc: string;
  img: string;
};

export async function GET() {
  try {
    const keunggulanData = await cachedPublicQuery<KeunggulanOutput[]>(
      ["public-keunggulan"],
      "keunggulan",
      async () => {
        const dbKeunggulan = await prisma.keunggulan.findMany({
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            image: true,
          },
          orderBy: { created_at: "asc" },
        });

        return dbKeunggulan.map((item) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          desc: item.description ?? "",
          img: item.image ?? "/images/default-keunggulan.jpg",
        }));
      }
    );

    return publicJsonResponse(keunggulanData);
  } catch (error) {
    console.error("Error mengambil data keunggulan:", error);
    return NextResponse.json(
      { error: "Gagal memuat data keunggulan" },
      { status: 500 }
    );
  }
}