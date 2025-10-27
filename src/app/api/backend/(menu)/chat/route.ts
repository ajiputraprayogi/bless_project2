import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ GET untuk ambil semua chat
export async function GET() {
  try {
    const chat = await prisma.chat.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        discount: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Prisma error (GET Chat):", error);
    return NextResponse.json(
      { error: "Failed to fetch chat" },
      { status: 500 }
    );
  }
}

// ✅ POST untuk buat chat baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, discount } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title dan description wajib diisi" },
        { status: 400 }
      );
    }

    const newChat = await prisma.chat.create({
      data: {
        title,
        description,
        discount: discount ?? null,
      },
    });

    return NextResponse.json(newChat, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST Chat):", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}
