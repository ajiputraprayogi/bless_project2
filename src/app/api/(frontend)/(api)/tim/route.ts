import { NextResponse } from "next/server";
import { sizePattern } from "@/utils/size";

// Dummy data tim
const dummyTeam = [
  {
    id: 1,
    nama: "Ferry",
    posisi: "Arsitek Senior",
    image: "/images/user/ferry.jpg",
  },
  {
    id: 2,
    nama: "Rina",
    posisi: "Desainer Interior",
    image: "/images/user/ferry.jpg",
  },
  {
    id: 3,
    nama: "Dani",
    posisi: "Manajer Proyek",
    image: "/images/user/ferry.jpg",
  },
];

export async function GET() {
  try {
    // ✅ Map dummy data agar sesuai format frontend
    const teamWithSize = dummyTeam.map((member, idx) => ({
      id: member.id,
      title: member.nama,       // sesuai frontend
      desc: member.posisi,      // posisi sebagai deskripsi
      img: member.image ?? "/images/default-image.jpg",
      size: sizePattern[idx % sizePattern.length],
    }));

    return NextResponse.json(teamWithSize);
  } catch (error) {
    console.error("Error mengambil data tim:", error);
    return NextResponse.json(
      { error: "Gagal memuat data tim" },
      { status: 500 }
    );
  }
}
