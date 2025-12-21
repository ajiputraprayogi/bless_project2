import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Ambil thumbnail otomatis dari link YouTube
 */
function getYoutubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
  );

  if (!match) return null;

  const videoId = match[1];
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * GET: Ambil semua portofolio video
 */
export async function GET() {
  try {
    const videos = await prisma.portofolio_video.findMany({
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("GET portofolio video error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data portofolio video" },
      { status: 500 }
    );
  }
}

/**
 * POST: Simpan portofolio video
 */
export async function POST(request: Request) {
  try {
    const { title, link } = await request.json();

    // VALIDASI
    if (!title || !link) {
      return NextResponse.json(
        { error: "Judul dan link wajib diisi" },
        { status: 400 }
      );
    }

    const thumbnail = getYoutubeThumbnail(link);

    if (!thumbnail) {
      return NextResponse.json(
        { error: "Link YouTube tidak valid" },
        { status: 400 }
      );
    }

    const newVideo = await prisma.portofolio_video.create({
      data: {
        title,
        link,
        thumbnail,
      },
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("POST portofolio video error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan portofolio video" },
      { status: 500 }
    );
  }
}
