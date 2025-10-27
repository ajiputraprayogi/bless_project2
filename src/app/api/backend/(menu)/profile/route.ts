import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ GET untuk ambil semua Profile + relasi misi
export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      select: {
        id: true,
        sejarah: true,
        visi: true,
        misi: {
          select: {
            id: true,
            text: true,
          },
          orderBy: { id: "asc" }, // urut berdasarkan id
        },
      },
      orderBy: { id: "asc" }, // urut berdasarkan id profile
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Prisma error (GET Profile):", error);
    return NextResponse.json(
      { error: "Failed to fetch Profile" },
      { status: 500 }
    );
  }
}

// ✅ POST untuk buat Profile baru beserta misi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sejarah, visi, misi } = body;

    if (!sejarah || !visi || !Array.isArray(misi)) {
      return NextResponse.json(
        { error: "Sejarah, visi, dan misi wajib diisi (misi harus berupa array)" },
        { status: 400 }
      );
    }

    const newProfile = await prisma.profile.create({
      data: {
        sejarah,
        visi,
        misi: {
          create: misi.map((text: string) => ({
            text, // hanya text karena sortOrder tidak ada di schema
          })),
        },
      },
      include: {
        misi: true, // supaya langsung dapat daftar misi setelah create
      },
    });

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST Profile):", error);
    return NextResponse.json(
      { error: "Failed to create Profile" },
      { status: 500 }
    );
  }
}
