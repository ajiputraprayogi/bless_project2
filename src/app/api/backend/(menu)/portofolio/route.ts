import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // pakai service role biar bisa upload tanpa auth user
);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

async function generateUniqueSlug(name: string) {
  let baseSlug = slugify(name);
  let uniqueSlug = baseSlug;
  let count = 1;

  while (await prisma.portofolio.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${count++}`;
  }

  return uniqueSlug;
}

// ✅ GET untuk ambil semua portofolio
export async function GET() {
  try {
    const portofolio = await prisma.portofolio.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        description: true,
        created_by: true,
        created_at: true,
      },
      orderBy: { id: "asc" },
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

// ✅ POST untuk buat portofolio baru + upload image ke Supabase
export async function POST(request: Request) {
  try {
    // Ambil form data
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;

    if (!name) {
      return NextResponse.json(
        { error: "Nama portofolio wajib diisi" },
        { status: 400 }
      );
    }

    // Generate slug unik
    const slug = await generateUniqueSlug(name);

    // Upload gambar jika ada
    let imageUrl: string | null = null;
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${slug}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("portofolio-images")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        }); 

      if (error) {
        console.error("Supabase upload error:", error);
        return NextResponse.json(
          { error: "Gagal upload gambar" },
          { status: 500 }
        );
      }

      // Ambil public URL
      const { data: publicUrl } = supabase.storage
        .from("portofolio-images")
        .getPublicUrl(fileName);
      imageUrl = publicUrl.publicUrl;
    }

    const createdBy = 1; // TODO: ambil dari session user

    // Simpan ke database via Prisma
    const newPortofolio = await prisma.portofolio.create({
      data: {
        name,
        slug,
        created_by: createdBy,
        image: imageUrl,
        description: description || null,
      },
    });

    return NextResponse.json(newPortofolio, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST):", error);
    return NextResponse.json(
      { error: "Failed to create portofolio" },
      { status: 500 }
    );
  }
}
