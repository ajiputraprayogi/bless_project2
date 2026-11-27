import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const profileData = await cachedPublicQuery(
      ["public-profile"],
      "profile",
      async () => {
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
              orderBy: { id: "asc" },
            },
          },
          orderBy: { created_at: "desc" },
        });

        if (!dbProfile) return null;

        return {
          id: dbProfile.id,
          sejarah: dbProfile.sejarah,
          visi: dbProfile.visi,
          misi: dbProfile.misi.map((m) => m.text),
        };
      }
    );

    if (!profileData) {
      return NextResponse.json(
        { error: "Data profil tidak ditemukan" },
        { status: 404 }
      );
    }

    return publicJsonResponse(profileData);
  } catch (error) {
    console.error("Error mengambil data profil:", error);
    return NextResponse.json(
      { error: "Gagal memuat data profil" },
      { status: 500 }
    );
  }
}