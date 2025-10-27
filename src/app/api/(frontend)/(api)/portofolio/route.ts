// src/app/(frontend)/dummyapi/data/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sizePattern } from "@/utils/size";

export async function GET() {
  try {
    // ✅ Ambil data portofolio dari database termasuk slug
    const dbPortofolio = await prisma.portofolio.findMany({
      select: {
        id: true,
        slug: true, // <-- tambahkan slug
        name: true,
        description: true,
        image: true,
      },
      orderBy: { created_at: "desc" },
    });

    // ✅ Map agar sesuai dengan format project
    const projectsWithSize = dbPortofolio.map((proj, idx) => ({
      id: proj.id,
      slug: proj.slug, // <-- kirim slug ke frontend
      title: proj.name,
      desc: proj.description ?? "",
      img: proj.image ?? "/images/default-image.jpg",
      size: sizePattern[idx % sizePattern.length],
    }));

    return NextResponse.json(projectsWithSize);
  } catch (error) {
    console.error("Error mengambil data portofolio:", error);
    return NextResponse.json(
      { error: "Gagal memuat data portofolio" },
      { status: 500 }
    );
  }
}
