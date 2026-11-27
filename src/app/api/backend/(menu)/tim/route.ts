import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// ✅ GET untuk ambil semua tim
export async function GET() {
  try {
    const tim = await prisma.tim.findMany({
      select: {
        id: true,
        nama: true,
        posisi: true,
        image: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(tim);
  } catch (error) {
    console.error("Prisma error (GET):", error);
    return NextResponse.json(
      { error: "Failed to fetch tim" },
      { status: 500 }
    );
  }
}

// ✅ POST untuk buat anggota tim baru + upload image ke Supabase
export async function POST(request: Request) {
  try {
    // Ambil form data
    const formData = await request.formData();
    const nama = formData.get("nama") as string;
    const posisi = formData.get("posisi") as string;
    const imageFile = formData.get("image") as File | null;

    if (!nama || !posisi) {
      return NextResponse.json(
        { error: "Nama dan posisi wajib diisi" },
        { status: 400 }
      );
    }

    // Upload gambar jika ada
    let imageUrl: string | null = null;
    if (imageFile) {
      const supabase = getSupabaseAdmin();
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `tim-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("tim-images")
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
        .from("tim-images")
        .getPublicUrl(fileName);
      imageUrl = publicUrl.publicUrl;
    }

    // Simpan ke database via Prisma
    const newTim = await prisma.tim.create({
      data: {
        nama,
        posisi,
        image: imageUrl,
      },
    });

    revalidateTag("tim");

    return NextResponse.json(newTim, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST):", error);
    return NextResponse.json(
      { error: "Failed to create tim" },
      { status: 500 }
    );
  }
}
