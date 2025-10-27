import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase environment variables are missing");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
      const oldFilePath = existing.image.split("/").pop();
      await supabase.storage.from("tim-images").remove([oldFilePath]);
    }

    await prisma.tim.delete({ where: { id } });

    return NextResponse.json({ message: "Anggota tim berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Prisma error (DELETE):", error);
    return NextResponse.json({ error: "Gagal menghapus data tim" }, { status: 500 });
  }
}
