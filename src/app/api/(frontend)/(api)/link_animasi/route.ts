import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Ambil semua link animasi dari database
    const data = await prisma.link_animasi.findMany({
      select: {
        // id: true,
        link: true,
        // created_at: true,
        // updated_at: true,
      },
      orderBy: {
        created_at: "desc", // terbaru di atas
      },
    });

    // Jika kosong, bisa tetap return array kosong
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET link_animasi error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data link animasi" },
      { status: 500 }
    );
  }
}
