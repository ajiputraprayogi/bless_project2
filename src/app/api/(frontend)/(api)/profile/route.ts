// src/app/(frontend)/dummyapi/profile/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // ✅ Ambil data profil terbaru atau pertama dari database, termasuk misi yang berelasi
    const dbProfile = await prisma.profile.findFirst({
      select: {
        id: true,
        sejarah: true,
        visi: true,
        misi: {
          select: {
            id: true,
            text: true,
          },
          orderBy: { id: "asc" }, // Urutkan misi berdasarkan ID atau kriteria lain jika ada
        },
      },
      orderBy: { created_at: "desc" }, // Ambil profil yang paling baru dibuat
    });

    if (!dbProfile) {
      return NextResponse.json({
        error: "Data profil tidak ditemukan"
      }, {
        status: 404
      });
    }

    // ✅ Map agar sesuai dengan format yang lebih sederhana jika diperlukan
    // Karena struktur data sudah cukup bersih, kita hanya melakukan mapping sederhana
    const profileData = {
      id: dbProfile.id,
      sejarah: dbProfile.sejarah,
      visi: dbProfile.visi,
      misi: dbProfile.misi.map(m => m.text), // Hanya ambil array teks misi
      // Jika ingin mengirim objek misi lengkap:
      // misi_list: dbProfile.misi 
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("Error mengambil data profil:", error);
    return NextResponse.json(
      { error: "Gagal memuat data profil" },
      { status: 500 }
    );
  }
}