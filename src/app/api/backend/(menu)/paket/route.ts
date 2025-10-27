import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ GET untuk ambil semua Paket
export async function GET() {
  try {
    const pakets = await prisma.paket.findMany({
      select: {
        id: true,
        name: true,
        harga: true,
        fitur: {
          select: { id: true, fitur: true },
        },
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(pakets);
  } catch (error) {
    console.error("Prisma error (GET Paket):", error);
    return NextResponse.json(
      { error: "Failed to fetch Paket" },
      { status: 500 }
    );
  }
}

// ✅ POST untuk buat Paket baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, harga, fitur } = body;

    if (!name || !harga) {
      return NextResponse.json(
        { error: "Nama paket dan harga wajib diisi" },
        { status: 400 }
      );
    }

    const newPaket = await prisma.paket.create({
      data: {
        name,
        harga,
        fitur: {
          create: Array.isArray(fitur)
            ? fitur
                .filter((f) => f.trim() !== "")
                .map((f) => ({ fitur: f }))
            : [],
        },
      },
      include: { fitur: true },
    });

    return NextResponse.json(newPaket, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST Paket):", error);
    return NextResponse.json(
      { error: "Failed to create Paket" },
      { status: 500 }
    );
  }
}
