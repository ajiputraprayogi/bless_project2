import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = [
      {
        id: 1,
        judul: "Kelebihan Produk",
        type: "kelebihan",
        kelebihan_kekurangan_detail: [
          { id: 1, detail: "Desain modern" },
          { id: 2, detail: "Material berkualitas" },
        ],
      },
      {
        id: 2,
        judul: "Kekurangan Produk",
        type: "kekurangan",
        kelebihan_kekurangan_detail: [
          { id: 3, detail: "Harga cukup mahal" },
          { id: 4, detail: "Berat untuk dibawa" },
        ],
      },
    ];

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching dummy kelebihan/kekurangan:", error);
    return NextResponse.json(
      { error: "Gagal memuat data Kelebihan/Kekurangan dummy" },
      { status: 500 }
    );
  }
}
