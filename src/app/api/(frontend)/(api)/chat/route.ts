import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const chat = await cachedPublicQuery(["public-chat"], "chat", async () =>
      prisma.chat.findFirst({
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          discount: true,
        },
      })
    );

    if (!chat) {
      return NextResponse.json(
        { error: "Data chat tidak ditemukan" },
        { status: 404 }
      );
    }

    return publicJsonResponse(chat);
  } catch (error) {
    console.error("Error mengambil data chat:", error);
    return NextResponse.json(
      { error: "Gagal memuat data chat" },
      { status: 500 }
    );
  }
}
