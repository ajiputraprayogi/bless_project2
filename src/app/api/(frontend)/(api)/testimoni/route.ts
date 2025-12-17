import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // ✅ Ambil semua Testimoni, urutkan berdasarkan ID DESC (terbaru di atas)
    // Sesuai dengan skema Anda: id, client, message, alt, video, avatar, src
    const testimoni = await prisma.testimoni.findMany({
      select: {
        id: true,
        client: true,
        message: true,
        alt: true,
        video: true,
        avatar: true, 
        src: true,
        // created_at dan updated_at dihapus karena tidak ada di skema
      },
      orderBy: { id: "desc" }, // Umumnya testimoni diurutkan dari yang terbaru
    });

    if (!testimoni || testimoni.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data Testimoni ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimoni, { status: 200 });
  } catch (error) {
    console.error("Error mengambil data Testimoni:", error);
    return NextResponse.json(
      { error: "Gagal memuat data Testimoni" },
      { status: 500 }
    );
  }
}