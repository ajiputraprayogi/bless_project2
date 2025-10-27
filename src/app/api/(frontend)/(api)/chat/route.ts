import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // ✅ Ambil chat pertama (atau bisa pakai findMany kalau mau semua chat)
    const chat = await prisma.chat.findFirst({
      orderBy: { created_at: "desc" }, // ambil chat terbaru
      select: {
        id: true,
        title: true,
        description: true,
        discount: true,
      },
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Data chat tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error mengambil data chat:", error);
    return NextResponse.json(
      { error: "Gagal memuat data chat" },
      { status: 500 }
    );
  }
}
