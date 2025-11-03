import { NextResponse } from "next/server";

export async function GET() {
  try {
    // ✅ Dummy data banner
    const banners = [
      { id: 1, img: "/images/design/1.png", active: true },
      { id: 2, img: "/images/design/2.png", active: true },
      { id: 3, img: "/images/design/3.png", active: false },
      { id: 4, img: "/images/design/4.png", active: true },
      { id: 5, img: "/images/design/5.png", active: false },
    ];

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching dummy banners:", error);
    return NextResponse.json(
      { error: "Gagal memuat data banner dummy" },
      { status: 500 }
    );
  }
}
