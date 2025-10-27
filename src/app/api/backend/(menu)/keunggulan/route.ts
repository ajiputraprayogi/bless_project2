import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

// --- Supabase Setup ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // pakai service role biar bisa upload tanpa auth user
);

// --- Utility Functions ---

// Digunakan untuk slugify title jika diperlukan
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

// Fungsi ini disesuaikan untuk model keunggulan
// Fungsi ini sekarang memeriksa keunikan slug pada model `keunggulan`
async function generateUniqueSlug(baseSlug: string) {
  let uniqueSlug = baseSlug;
  let count = 1;

  while (await prisma.keunggulan.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${count++}`;
  }

  return uniqueSlug;
}

// =========================================================================
// ✅ GET untuk ambil semua keunggulan
// =========================================================================
export async function GET() {
  try {
    const keunggulan = await prisma.keunggulan.findMany({
      select: {
        id: true,
        title: true, // Ambil title
        slug: true,
        image: true,
        description: true,
        created_by: true,
        created_at: true,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(keunggulan);
  } catch (error) {
    console.error("Prisma error (GET Keunggulan):", error);
    return NextResponse.json(
      { error: "Failed to fetch keunggulan" },
      { status: 500 }
    );
  }
}

// =========================================================================
// ✅ POST untuk buat keunggulan baru + upload image ke Supabase
// =========================================================================
export async function POST(request: Request) {
  try {
    // Ambil form data
    const formData = await request.formData();
    // Properti diubah dari 'name' menjadi 'title' dan ditambahkan 'slug'
    const title = formData.get("title") as string;
    let userSlug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File | null;

    if (!title) {
      return NextResponse.json(
        { error: "Judul keunggulan wajib diisi" },
        { status: 400 }
      );
    }
    
    // Jika user tidak menyediakan slug, generate dari title
    if (!userSlug) {
        userSlug = title;
    }

    // Slugify dan pastikan unik
    const baseSlug = slugify(userSlug);
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    // Upload gambar jika ada
    let imageUrl: string | null = null;
    const bucketName = "keunggulan-images"; // Ganti nama bucket Supabase
    
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      // Gunakan uniqueSlug untuk penamaan file
      const fileName = `${uniqueSlug}-${Date.now()}.${fileExt}`; 
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return NextResponse.json(
          { error: `Gagal upload gambar ke ${bucketName}` },
          { status: 500 }
        );
      }

      // Ambil public URL
      const { data: publicUrl } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      imageUrl = publicUrl.publicUrl;
    }

    const createdBy = 1; // TODO: ambil dari session user

    // Simpan ke database via Prisma pada model keunggulan
    const newKeunggulan = await prisma.keunggulan.create({
      data: {
        title, // Gunakan title
        slug: uniqueSlug, // Gunakan uniqueSlug
        created_by: createdBy,
        image: imageUrl,
        description: description || null,
      },
    });

    return NextResponse.json(newKeunggulan, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST Keunggulan):", error);
    // Periksa jika error karena slug tidak unik (error code TBD)
    if (error instanceof Error && (error as any).code === 'P2002') { 
        return NextResponse.json(
            { error: "Slug sudah ada. Coba lagi dengan Judul/Slug yang berbeda." },
            { status: 409 }
        );
    }
    return NextResponse.json(
      { error: "Failed to create keunggulan" },
      { status: 500 }
    );
  }
}