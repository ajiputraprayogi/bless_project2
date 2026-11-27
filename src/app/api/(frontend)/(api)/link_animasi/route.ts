import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const data = await cachedPublicQuery(
      ["public-link-animasi"],
      "link_animasi",
      async () =>
        prisma.link_animasi.findMany({
          select: {
            link: true,
          },
          orderBy: {
            created_at: "desc",
          },
        })
    );

    return publicJsonResponse(data, 200);
  } catch (error) {
    console.error("GET link_animasi error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data link animasi" },
      { status: 500 }
    );
  }
}
