import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get("type"); // contoh: ?type=kontraktor

    // Build filter
    const whereCondition: any = {};

    if (typeFilter && typeFilter.toLowerCase() !== "all") {
      whereCondition.type = {
        equals: typeFilter,
        mode: "insensitive",
      };
    }

    // Ambil data dari database
    const dbPortofolio = await prisma.portofolio.findMany({
      where: whereCondition,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        type: true,
        portofolio_images: {
          select: { url: true },
          orderBy: { id: "asc" },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Mapping menjadi format yang diminta
    const projects = dbPortofolio.map((proj) => ({
      id: proj.id,
      slug: proj.slug,
      name: proj.name,
      description: proj.description || "",
      images: proj.portofolio_images.map((img) => img.url), // array string
      type: proj.type,
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Gagal memuat data portofolio dari database" },
      { status: 500 }
    );
  }
}
