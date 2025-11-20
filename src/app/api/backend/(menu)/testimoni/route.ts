import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- GET All Testimoni ---
export async function GET() {
  try {
    const testimoni = await prisma.testimoni.findMany({
      select: {
        id: true,
        client: true,
        message: true,
        alt: true,
        video: true,
        avatar: true, // URL Avatar
        src: true, // URL Gambar Desain
        // created_by, created_at, updated_at DIHAPUS agar sesuai dengan skema
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(testimoni);
  } catch (error) {
    console.error("Prisma error (GET Testimoni):", error);
    return NextResponse.json(
      { error: "Failed to fetch testimoni" },
      { status: 500 }
    );
  }
}

// --- POST Create Testimoni ---
export async function POST(request: Request) {
  const MAX_SIZE = 500 * 1024; // 500 KB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  
  // const createdBy = 1; <-- VARIABEL INI TIDAK LAGI DIGUNAKAN

  try {
    const formData = await request.formData();
    const client = formData.get("client") as string;
    const message = formData.get("message") as string;
    const alt = (formData.get("alt") as string) || null;
    const video = (formData.get("video") as string) || null;

    // File: Avatar dan Src (Gambar Desain)
    const avatarFile = formData.get("avatar");
    const srcFile = formData.get("src");

    // VALIDASI WAJIB
    if (!client || !message) {
      return NextResponse.json(
        { error: "Nama Klien dan Pesan wajib diisi" },
        { status: 400 }
      );
    }

    if (!(avatarFile instanceof File) || !(srcFile instanceof File)) {
      return NextResponse.json(
        { error: "Avatar Klien dan Gambar Desain wajib diunggah" },
        { status: 400 }
      );
    }

    // Gabungkan file untuk validasi loop
    const filesToUpload = [
      { file: avatarFile, fieldName: "Avatar" },
      { file: srcFile, fieldName: "Gambar Desain" },
    ];

    for (const { file, fieldName } of filesToUpload) {
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `Ukuran file '${fieldName}' maksimal 500 KB` },
          { status: 400 }
        );
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Format file '${fieldName}' tidak valid (JPG, PNG, WebP saja)` },
          { status: 400 }
        );
      }
    }

    // UPLOAD GAMBAR KE SUPABASE
    const uploadedUrls: { avatar?: string; src?: string } = {};

    for (const { file, fieldName } of filesToUpload) {
      const isAvatar = fieldName === "Avatar";
      const bucketName = isAvatar ? "testimoni-avatars" : "testimoni-src";
      
      const fileExt = file.name.split(".").pop();
      // Gunakan nama klien + field name untuk nama file yang lebih informatif
      const baseName = client.toLowerCase().replace(/\s/g, "_"); 
      const fileName = `${baseName}-${isAvatar ? 'avatar' : 'src'}-${Date.now()}.${fileExt}`;

      // Menggunakan file secara langsung (sudah merupakan tipe File)
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError);
        // TODO: Implementasi rollback (hapus file yang sudah terupload) jika terjadi error
        return NextResponse.json(
          { error: `Gagal upload ${fieldName}: ${file.name}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (isAvatar) {
        uploadedUrls.avatar = publicUrlData.publicUrl;
      } else {
        uploadedUrls.src = publicUrlData.publicUrl;
      }
    }
    
    // VALIDASI FINAL URL
    if (!uploadedUrls.avatar || !uploadedUrls.src) {
        return NextResponse.json(
            { error: "Gagal mendapatkan URL publik untuk file yang diunggah." },
            { status: 500 }
        );
    }

    // SIMPAN PRISMA
    const newTestimoni = await prisma.testimoni.create({
      data: {
        client,
        message,
        alt,
        video,
        avatar: uploadedUrls.avatar,
        src: uploadedUrls.src,
        // created_by DIHAPUS
      },
    });

    return NextResponse.json(newTestimoni, { status: 201 });
  } catch (error) {
    console.error("Prisma/General Error (POST Testimoni):", error);
    return NextResponse.json(
      { error: "Failed to create testimoni due to server error." },
      { status: 500 }
    );
  }
}