import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * -----------------------
 * GET ALL DUMMY TESTI
 * -----------------------
 */
export async function GET() {
  try {
    const testimoni = await prisma.dummy_testi.findMany({
      select: {
        id: true,
        client: true,
        message: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(testimoni);
  } catch (error) {
    console.error("Prisma error (GET dummy_testi):", error);
    return NextResponse.json(
      { error: "Failed to fetch dummy testimoni" },
      { status: 500 }
    );
  }
}

/**
 * -----------------------
 * POST CREATE DUMMY TESTI
 * -----------------------
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { client, message } = body;

    // VALIDASI
    if (!client || !message) {
      return NextResponse.json(
        { error: "Client dan message wajib diisi" },
        { status: 400 }
      );
    }

    const newTestimoni = await prisma.dummy_testi.create({
      data: {
        client,
        message,
      },
    });

    return NextResponse.json(newTestimoni, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST dummy_testi):", error);
    return NextResponse.json(
      { error: "Failed to create dummy testimoni" },
      { status: 500 }
    );
  }
}
