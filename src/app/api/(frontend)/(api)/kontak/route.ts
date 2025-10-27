// src/app/(frontend)/dummyapi/kontak/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // ✅ Ambil data kontak dari database
    const dbKontak = await prisma.kontak.findMany({
      select: {
        id: true,
        platform: true,
        url: true,
        icon: true,
        is_active: true,
      },
      orderBy: { order: "asc" },
    });

    // ✅ Filter hanya yang aktif & formatkan data
    const kontakFormatted = dbKontak
      .filter((k) => k.is_active)
      .map((k) => ({
        id: k.id,
        platform: k.platform,
        url: k.url,
        icon: k.icon || "link", // fallback kalau icon kosong
      }));

    return NextResponse.json(kontakFormatted);
  } catch (error) {
    console.error("Error mengambil data kontak:", error);
    return NextResponse.json(
      { error: "Gagal memuat data kontak" },
      { status: 500 }
    );
  }
}
