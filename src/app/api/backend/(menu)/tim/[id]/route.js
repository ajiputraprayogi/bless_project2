import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

// ✅ Ambil detail tim
export async function GET(req, context) {
  try {
    const { params } = await context;
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const tim = await prisma.tim.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        posisi: true,
        image: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!tim) {
      return NextResponse.json({ error: "Data tim tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(tim, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET by ID):", error);
    return NextResponse.json({ error: "Gagal mengambil data tim" }, { status: 500 });
  }
}

// ✅ Update tim
export async function PUT(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const formData = await req.formData();
    const nama = formData.get("nama")?.toString() || null;
    const posisi = formData.get("posisi")?.toString() || null;
    const file = formData.get("image");

    const existing = await prisma.tim.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Data tim tidak ditemukan" }, { status: 404 });
    }

    let imageUrl = existing.image;

    if (file && file.size > 0) {
      const supabase = getSupabaseAdmin();
      if (existing.image) {
        const oldFilePath = existing.image.split("/").pop();
        await supabase.storage.from("tim-images").remove([oldFilePath]);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop();
      const fileName = `tim-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("tim-images")
        .upload(fileName, buffer, { contentType: file.type, upsert: true });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw new Error("Gagal upload file ke Supabase");
      }

      const { data } = supabase.storage.from("tim-images").getPublicUrl(fileName);
      if (data?.publicUrl) imageUrl = data.publicUrl;
    }

    const updated = await prisma.tim.update({
      where: { id },
      data: {
        nama: nama ?? existing.nama,
        posisi: posisi ?? existing.posisi,
        image: imageUrl,
      },
    });

    revalidateTag("tim");

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT):", error);
    return NextResponse.json({ error: "Gagal update data tim" }, { status: 500 });
  }
}

// ✅ Hapus tim
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.tim.findUnique({ where: { id } });
    if (existing?.image) {
      const supabase = getSupabaseAdmin();
      const oldFilePath = existing.image.split("/").pop();
      await supabase.storage.from("tim-images").remove([oldFilePath]);
    }

    await prisma.tim.delete({ where: { id } });
    revalidateTag("tim");

    return NextResponse.json({ message: "Anggota tim berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Prisma error (DELETE):", error);
    return NextResponse.json({ error: "Gagal menghapus data tim" }, { status: 500 });
  }
}
