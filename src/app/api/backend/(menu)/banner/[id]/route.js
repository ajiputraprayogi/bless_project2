import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// ✅ GET detail banner by ID
export async function GET(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const banner = await prisma.banner.findUnique({
      where: { id },
      select: {
        id: true,
        image: true,
        is_active: true,
        created_by: true,
        created_at: true,
      },
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(banner, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET Banner):", error);
    return NextResponse.json({ error: "Gagal mengambil banner" }, { status: 500 });
  }
}

// ✅ UPDATE banner
export async function PUT(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const formData = await req.formData();
    const isActive = formData.get("is_active") === "true";
    const file = formData.get("image");

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Banner tidak ditemukan" }, { status: 404 });
    }

    let imageUrl = existing.image;

    // ✅ Upload file baru jika ada
    if (file && file.size > 0) {
      const supabase = getSupabaseAdmin();
      if (existing.image) {
        const oldFilePath = existing.image.split("/").pop();
        await supabase.storage.from("banner-images").remove([oldFilePath]);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();
      const fileName = `banner-${Date.now()}.${ext}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("banner-images")
        .upload(filePath, buffer, { contentType: file.type, upsert: true });

      if (uploadError) {
        throw new Error("Gagal upload file ke Supabase");
      }

      const { data } = supabase.storage
        .from("banner-images")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        imageUrl = data.publicUrl;
      }
    }

    const updated = await prisma.banner.update({
      where: { id },
      data: {
        is_active: isActive,
        image: imageUrl,
      },
    });

    revalidateTag("banner");

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT Banner):", error);
    return NextResponse.json({ error: "Gagal update banner" }, { status: 500 });
  }
}

// ✅ DELETE banner
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.banner.findUnique({ where: { id } });
    if (existing?.image) {
      const supabase = getSupabaseAdmin();
      const oldFilePath = existing.image.split("/").pop();
      await supabase.storage.from("banner-images").remove([oldFilePath]);
    }

    await prisma.banner.delete({ where: { id } });
    revalidateTag("banner");

    return NextResponse.json({ message: "Banner berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Prisma error (DELETE Banner):", error);
    return NextResponse.json({ error: "Gagal menghapus banner" }, { status: 500 });
  }
}
