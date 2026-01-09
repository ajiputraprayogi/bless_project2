import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * -----------------------
 * GET ALL LINK ANIMASI
 * -----------------------
 */
export async function GET() {
  try {
    const animasi = await prisma.link_animasi.findMany({
      select: {
        id: true,
        link: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(animasi);
  } catch (error) {
    console.error("Prisma error (GET link_animasi):", error);
    return NextResponse.json(
      { error: "Failed to fetch link animasi" },
      { status: 500 }
    );
  }
}

/**
 * -----------------------
 * POST CREATE LINK ANIMASI
 * -----------------------
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { link } = body;

    // VALIDASI
    if (!link) {
      return NextResponse.json(
        { error: "Link animasi wajib diisi" },
        { status: 400 }
      );
    }

    const newAnimasi = await prisma.link_animasi.create({
      data: {
        link,
      },
    });

    return NextResponse.json(newAnimasi, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST link_animasi):", error);
    return NextResponse.json(
      { error: "Failed to create link animasi" },
      { status: 500 }
    );
  }
}
