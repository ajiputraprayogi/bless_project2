// src/app/(frontend)/dummyapi/data/[slug]/route.js

// Perhatian: Ganti nama file dan path sesuai kebutuhan, misalnya:
// src/app/api/frontend/keunggulan/[slug]/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_, { params }) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug tidak diberikan" },
        { status: 400 }
      );
    }

    // ✅ Cari keunggulan berdasarkan slug
    const keunggulan = await prisma.keunggulan.findUnique({ // <-- Ganti ke model keunggulan
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true, // <-- Ganti name ke title
        description: true,
        image: true,
        created_at: true,
      },
    });

    if (!keunggulan) {
      return NextResponse.json(
        { error: "Keunggulan tidak ditemukan" }, // <-- Ganti pesan error
        { status: 404 }
      );
    }

    return NextResponse.json(keunggulan);
  } catch (error) {
    console.error("Error mengambil keunggulan by slug:", error);
    return NextResponse.json(
      { error: "Gagal memuat data keunggulan" }, // <-- Ganti pesan error
      { status: 500 }
    );
  }
}