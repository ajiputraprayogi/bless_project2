import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // ✅ Ambil semua FAQ, urutkan berdasarkan sortOrder ASC
    const faqs = await prisma.faq.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        question: true,
        answer: true,
        sortOrder: true,
      },
    });

    if (!faqs || faqs.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data FAQ ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    console.error("Error mengambil data FAQ:", error);
    return NextResponse.json(
      { error: "Gagal memuat data FAQ" },
      { status: 500 }
    );
  }
}
