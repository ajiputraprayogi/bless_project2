import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const faqs = await cachedPublicQuery(["public-faq"], "faq", async () =>
      prisma.faq.findMany({
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          question: true,
          answer: true,
          sortOrder: true,
        },
      })
    );

    if (!faqs || faqs.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data FAQ ditemukan" },
        { status: 404 }
      );
    }

    return publicJsonResponse(faqs, 200);
  } catch (error) {
    console.error("Error mengambil data FAQ:", error);
    return NextResponse.json(
      { error: "Gagal memuat data FAQ" },
      { status: 500 }
    );
  }
}
