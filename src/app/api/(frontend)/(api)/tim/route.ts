// src/app/(frontend)/dummyapi/tim/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sizePattern } from "@/utils/size";

export async function GET() {
  try {
    // ✅ Ambil data tim dari database
    const dbTim = await prisma.tim.findMany({
      select: {
        id: true,
        nama: true,
        posisi: true,
        image: true,
      },
      orderBy: { created_at: "desc" },
    });

    // ✅ Map agar sesuai dengan format yang dipakai frontend
    const teamWithSize = dbTim.map((member, idx) => ({
      id: member.id,
      title: member.nama, // sesuai frontend
      desc: member.posisi, // posisi sebagai deskripsi
      img: member.image ?? "/images/default-image.jpg",
      size: sizePattern[idx % sizePattern.length],
    }));

    return NextResponse.json(teamWithSize);
  } catch (error) {
    console.error("Error mengambil data tim:", error);
    return NextResponse.json(
      { error: "Gagal memuat data tim" },
      { status: 500 }
    );
  }
}
