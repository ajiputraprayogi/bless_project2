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

// ✅ Ambil detail portofolio
export async function GET(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const portofolio = await prisma.portofolio.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        description: true,
        created_by: true,
        created_at: true,
      },
    });

    if (!portofolio) {
      return NextResponse.json({ error: "Portofolio tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(portofolio, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET by ID):", error);
    return NextResponse.json({ error: "Gagal mengambil portofolio" }, { status: 500 });
  }
}

// ✅ Update portofolio
export async function PUT(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString() || null;
    const description = formData.get("description")?.toString() || null;
    const file = formData.get("image");

    const existing = await prisma.portofolio.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Portofolio tidak ditemukan" }, { status: 404 });
    }

    // ✅ Generate slug baru jika name berubah
    const newName = name ?? existing.name;
    const newSlug = slugify(newName, { lower: true, strict: true });

    let imageUrl = existing.image;

    // ✅ Upload file baru jika ada
    if (file && file.size > 0) {
      if (existing.image) {
        const oldFilePath = existing.image.split("/").pop();
        await supabase.storage.from("portofolio-images").remove([oldFilePath]);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();

      // ✅ Nama file menjadi slug-timestamp.ext
      const fileName = `${newSlug}-${Date.now()}.${ext}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("portofolio-images")
        .upload(filePath, buffer, { contentType: file.type, upsert: true });

      if (uploadError) {
        throw new Error("Gagal upload file ke Supabase");
      }

      const { data } = supabase.storage
        .from("portofolio-images")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        imageUrl = data.publicUrl;
      }
    }

    const updated = await prisma.portofolio.update({
      where: { id },
      data: {
        name: newName,
        slug: newSlug, // ✅ update slug juga
        description: description ?? existing.description,
        image: imageUrl,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT):", error);
    return NextResponse.json({ error: "Gagal update portofolio" }, { status: 500 });
  }
}

// ✅ Hapus portofolio
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.portofolio.findUnique({ where: { id } });
    if (existing?.image) {
      const oldFilePath = existing.image.split("/").pop();
      await supabase.storage.from("portofolio-images").remove([oldFilePath]);
    }

    await prisma.portofolio.delete({ where: { id } });

    return NextResponse.json({ message: "Portofolio berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Prisma error (DELETE):", error);
    return NextResponse.json({ error: "Gagal menghapus portofolio" }, { status: 500 });
  }
}
