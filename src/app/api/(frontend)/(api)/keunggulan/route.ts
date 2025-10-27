// src/app/(frontend)/dummyapi/data/route.ts

// Perhatian: Ganti nama file dan path sesuai kebutuhan, misalnya:
// src/app/api/frontend/keunggulan/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
// import { sizePattern } from "@/utils/size"; // Dihapus karena tidak relevan untuk keunggulan

// Tipe data untuk format output
type KeunggulanOutput = {
  id: number;
  slug: string;
  title: string;
  desc: string;
  img: string;
  // size: string; // Dihapus
};


export async function GET() {
  try {
    // ✅ Ambil data keunggulan dari database
    const dbKeunggulan = await prisma.keunggulan.findMany({ // <-- Ganti ke model keunggulan
      select: {
        id: true,
        slug: true,
        title: true, // <-- Ganti name ke title
        description: true,
        image: true,
      },
      orderBy: { created_at: "asc" }, // Urutan biasanya ascending untuk daftar keunggulan
    });

    // ✅ Map agar sesuai dengan format yang sederhana
    const keunggulanData: KeunggulanOutput[] = dbKeunggulan.map((item) => ({
      id: item.id,
      slug: item.slug, 
      title: item.title, // <-- Ambil title
      desc: item.description ?? "",
      // Asumsi jika image null/kosong, gunakan placeholder default
      img: item.image ?? "/images/default-keunggulan.jpg", 
      // size: "normal", // Jika perlu properti size, berikan nilai default, atau hapus.
    }));

    return NextResponse.json(keunggulanData);
  } catch (error) {
    console.error("Error mengambil data keunggulan:", error);
    return NextResponse.json(
      { error: "Gagal memuat data keunggulan" },
      { status: 500 }
    );
  }
}