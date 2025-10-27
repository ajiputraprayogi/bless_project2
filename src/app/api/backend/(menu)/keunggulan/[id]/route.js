import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase environment variables are missing");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET_NAME = "keunggulan-images"; 

// =========================================================================
// ✅ GET untuk ambil detail keunggulan
// =========================================================================
export async function GET(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const keunggulan = await prisma.keunggulan.findUnique({
      where: { id },
      select: {
        id: true,
        title: true, 
        slug: true,
        image: true,
        description: true,
        created_by: true,
        created_at: true,
      },
    });

    if (!keunggulan) {
      return NextResponse.json({ error: "Keunggulan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(keunggulan, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET Keunggulan by ID):", error);
    return NextResponse.json({ error: "Gagal mengambil keunggulan" }, { status: 500 });
  }
}

// =========================================================================
// ✅ PUT untuk update keunggulan
// =========================================================================
export async function PUT(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const formData = await req.formData();
    // ✅ Ambil 'title'
    const title = formData.get("title")?.toString() || null;
    // userSlug diabaikan karena frontend tidak mengirimkannya.
    // const userSlug = formData.get("slug")?.toString() || null; 
    const description = formData.get("description")?.toString() || null;
    const file = formData.get("image");

    const existing = await prisma.keunggulan.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Keunggulan tidak ditemukan" }, { status: 404 });
    }

    // ✅ Tentukan Title dan Slug baru
    const newTitle = title ?? existing.title;
    
    // Logika penentuan base slug baru:
    // 1. Jika title berubah, kita buat slug baru dari title baru.
    // 2. Jika title tidak berubah, kita gunakan slug lama (existing.slug).
    const newBaseSlug = (title && title !== existing.title) 
      ? slugify(newTitle, { lower: true, strict: true }) 
      : existing.slug;


    // --- Logika Penjaminan Keunikan Slug ---
    let finalSlug = existing.slug;
    
    // Hanya lakukan pengecekan jika base slug baru berbeda dari slug yang sudah ada
    if (newBaseSlug !== existing.slug) {
        let count = 0;
        let tempSlug = newBaseSlug;
        
        while (await prisma.keunggulan.findUnique({ where: { slug: tempSlug } })) {
            // Jika slug yang dicek adalah slug milik record ini, ini berarti tidak ada perubahan slug, 
            // kita bisa menggunakan slug lama, dan break.
            if (tempSlug === existing.slug) {
                 break; 
            }
            
            // Jika slug milik orang lain, tambahkan counter
            count++;
            tempSlug = `${newBaseSlug}-${count}`;
            
            if (count > 100) throw new Error("Gagal generate slug unik"); 
        }
        finalSlug = tempSlug; // Ambil slug unik yang ditemukan
    } else {
        finalSlug = existing.slug; // Slug lama jika tidak ada perubahan title atau jika title yang baru menghasilkan slug yang sama
    }


    let imageUrl = existing.image;

    // ✅ Upload file baru jika ada
    if (file && file instanceof File && file.size > 0) {
      // Hapus gambar lama
      if (existing.image) {
        const oldFilePath = existing.image.split(BUCKET_NAME + "/")[1];
        if (oldFilePath) {
            await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
        }
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();

      // ✅ Nama file menggunakan finalSlug-timestamp.ext
      const fileName = `${finalSlug}-${Date.now()}.${ext}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME) 
        .upload(filePath, buffer, { contentType: file.type, upsert: true });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw new Error("Gagal upload file ke Supabase");
      }

      const { data } = supabase.storage
        .from(BUCKET_NAME) 
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        imageUrl = data.publicUrl;
      }
    }

    // Ganti model keunggulan
    const updated = await prisma.keunggulan.update({
      where: { id },
      data: {
        title: newTitle, 
        slug: finalSlug, // ✅ Update slug
        description: description ?? existing.description,
        image: imageUrl,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT Keunggulan):", error);
    
    // ✅ PERBAIKAN: Menghapus sintaks TypeScript 'as any'
    if (error instanceof Error && error.code === 'P2002') { 
        return NextResponse.json(
            { error: "Slug sudah ada. Coba lagi dengan Judul/Slug yang berbeda." },
            { status: 409 }
        );
    }
    
    return NextResponse.json({ error: "Gagal update keunggulan" }, { status: 500 });
  }
}

// =========================================================================
// ✅ DELETE untuk hapus keunggulan
// =========================================================================
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.keunggulan.findUnique({ where: { id } });
    
    // Hapus gambar lama dari Supabase
    if (existing?.image) {
      const oldFilePath = existing.image.split(BUCKET_NAME + "/")[1];
      if (oldFilePath) {
        await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]); 
      }
    }

    await prisma.keunggulan.delete({ where: { id } });

    return NextResponse.json({ message: "Keunggulan berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Prisma error (DELETE Keunggulan):", error);
    return NextResponse.json({ error: "Gagal menghapus keunggulan" }, { status: 500 });
  }
}