import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get("type")?.trim() || "";
    const slugFilter = searchParams.get("slug")?.trim() || "";

    const projects = await cachedPublicQuery(
      ["public-portofolio-eksteriors", typeFilter.toLowerCase(), slugFilter],
      "portofolio",
      async () => {
        const whereCondition: {
          type?: { equals: string; mode: "insensitive" };
          slug?: string;
        } = {};

        if (typeFilter && typeFilter.toLowerCase() !== "all") {
          whereCondition.type = {
            equals: typeFilter,
            mode: "insensitive",
          };
        }

        if (slugFilter) {
          whereCondition.slug = slugFilter;
        }

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

        return dbPortofolio.map((proj) => ({
          id: proj.id,
          slug: proj.slug,
          name: proj.name,
          description: proj.description || "",
          images: proj.portofolio_images.map((img) => img.url),
          type: proj.type,
        }));
      }
    );

    return publicJsonResponse(projects);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Gagal memuat data portofolio dari database" },
      { status: 500 }
    );
  }
}
