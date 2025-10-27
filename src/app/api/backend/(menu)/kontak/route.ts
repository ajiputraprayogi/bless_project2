import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ Ambil semua kontak
export async function GET() {
  try {
    const kontak = await prisma.kontak.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(kontak);
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kontak" },
      { status: 500 }
    );
  }
}

// ✅ Tambah kontak baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("POST body:", body); // ✅ Debug, cek nilai dari frontend

    const { platform, url, icon, order, is_active } = body;

    if (!platform || !url) {
      return NextResponse.json(
        { error: "Platform dan URL wajib diisi" },
        { status: 400 }
      );
    }

    const newKontak = await prisma.kontak.create({
      data: {
        platform,
        url,
        icon: icon ?? "",
        order: order ?? 0,
        is_active: Boolean(is_active), // ✅ Paksa jadi boolean (true/false)
      },
    });

    return NextResponse.json(newKontak, { status: 201 });
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan kontak" },
      { status: 500 }
    );
  }
}
