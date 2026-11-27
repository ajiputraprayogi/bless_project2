import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

async function generateUniqueSlug(name: string) {
  const baseSlug = slugify(name);
  const existing = await prisma.portofolio.findMany({
    where: { slug: { startsWith: baseSlug } },
    select: { slug: true },
  });

  const existingSet = new Set(existing.map((item) => item.slug));
  if (!existingSet.has(baseSlug)) return baseSlug;

  let count = 1;
  while (existingSet.has(`${baseSlug}-${count}`)) {
    count++;
  }
  return `${baseSlug}-${count}`;
}

export async function GET() {
  try {
    const portofolio = await prisma.portofolio.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        kategori: true,
        type: true,
        created_by: true,
        created_at: true,
        updated_at: true,
        portofolio_images: {
          select: { id: true, url: true },
          orderBy: { id: "asc" },
        },
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(portofolio);
  } catch (error) {
    console.error("Prisma error (GET):", error);
    return NextResponse.json(
      { error: "Failed to fetch portofolio" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const MAX_SIZE = 500 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const createdBy = 1;

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const kategori = (formData.get("kategori") as string) || null;
    const type = formData.get("type") as string;
    const imageFiles = formData.getAll("images") as File[];

    if (!name || !type) {
      return NextResponse.json(
        { error: "Nama dan Tipe wajib diisi" },
        { status: 400 }
      );
    }

    if (imageFiles.length === 0 || !(imageFiles[0] instanceof File)) {
      return NextResponse.json(
        { error: "Minimal satu gambar wajib diunggah" },
        { status: 400 }
      );
    }

    for (const imageFile of imageFiles) {
      if (imageFile.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `Ukuran file '${imageFile.name}' maksimal 500 KB` },
          { status: 400 }
        );
      }
      if (!ALLOWED_TYPES.includes(imageFile.type)) {
        return NextResponse.json(
          { error: `Format file '${imageFile.name}' tidak valid (JPG, PNG, WebP saja)` },
          { status: 400 }
        );
      }
    }

    const slug = await generateUniqueSlug(name);
    const supabase = getSupabaseAdmin();

    const imageUrls = await Promise.all(
      imageFiles.map(async (imageFile) => {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${slug}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("portofolio-images")
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error(`Gagal upload gambar: ${imageFile.name}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("portofolio-images")
          .getPublicUrl(fileName);

        return { url: publicUrlData.publicUrl };
      })
    );

    const newPortofolio = await prisma.portofolio.create({
      data: {
        name,
        slug,
        kategori: kategori || null,
        type,
        description: description || null,
        created_by: createdBy,
        portofolio_images: {
          create: imageUrls,
        },
      },
      include: {
        portofolio_images: true,
      },
    });

    revalidateTag("portofolio");

    return NextResponse.json(newPortofolio, { status: 201 });
  } catch (error) {
    console.error("Prisma/General Error (POST):", error);
    return NextResponse.json(
      { error: "Failed to create portofolio due to server error." },
      { status: 500 }
    );
  }
}
