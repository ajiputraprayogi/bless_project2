import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import slugify from "slugify";

// Mendapatkan filename dari URL Supabase
function getSupabaseFilePath(publicUrl) {
  if (!publicUrl) return null;

  const segments = publicUrl.split("/");
  const filename = segments.pop();
  const bucket = segments[segments.length - 1];

  if (bucket === "portofolio-images") {
    return filename;
  }
  return null;
}

// Generate slug unik saat update dalam 1 query
async function generateUniqueSlugForUpdate(name, id) {
  const baseSlug = slugify(name, { lower: true, strict: true });
  const existing = await prisma.portofolio.findMany({
    where: { slug: { startsWith: baseSlug } },
    select: { id: true, slug: true },
  });

  const takenSlugs = new Set(
    existing.filter((item) => item.id !== id).map((item) => item.slug)
  );
  if (!takenSlugs.has(baseSlug)) return baseSlug;

  let count = 1;
  while (takenSlugs.has(`${baseSlug}-${count}`)) {
    count++;
  }
  return `${baseSlug}-${count}`;
}

// ==========================================================================
// GET BY ID
// ==========================================================================
export async function GET(req, context) {
  try {
    // 🔥 PERBAIKAN: Mengakses context.params.id secara langsung
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
        description: true,
        kategori: true,
        type: true,
        created_by: true,
        created_at: true,
        portofolio_images: {
          select: {
            id: true,
            url: true,
          },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!portofolio) {
      return NextResponse.json({ error: "Portofolio tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(portofolio, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Gagal mengambil portofolio" }, { status: 500 });
  }
}

// ==========================================================================
// PATCH — UPDATE PORTFOLIO + MULTIPLE IMAGES
// ==========================================================================
export async function PATCH(req, context) {
  try {
    // 🔥 PERBAIKAN: Mengakses context.params.id secara langsung
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const MAX_SIZE = 500 * 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

    const formData = await req.formData();

    const name = formData.get("name")?.toString() || null;
    const description = formData.get("description")?.toString() || null;
    const kategori = formData.get("kategori")?.toString() || null; 
    const type = formData.get("type")?.toString() || null;

    const newImageFiles = formData.getAll("new_images");
    const imagesToDeleteJson = formData.get("images_to_delete")?.toString();
    const imagesToDelete = imagesToDeleteJson ? JSON.parse(imagesToDeleteJson) : [];

    const existing = await prisma.portofolio.findUnique({
      where: { id },
      include: { portofolio_images: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Portofolio tidak ditemukan" }, { status: 404 });
    }

    const newName = name ?? existing.name;
    const newKategori = kategori ?? existing.kategori;
    const newType = type ?? existing.type;

    if (!newName || !newType) {
      return NextResponse.json(
        { error: "Nama dan Type wajib diisi" },
        { status: 400 }
      );
    }

    const remainingImages =
      existing.portofolio_images.filter((img) => !imagesToDelete.includes(img.id)).length;

    if (remainingImages + newImageFiles.length === 0) {
      return NextResponse.json(
        { error: "Minimal harus ada satu gambar." },
        { status: 400 }
      );
    }

    const newSlug = await generateUniqueSlugForUpdate(newName, id);

    // --------------------------------------------------
    // 1. HAPUS GAMBAR LAMA (Supabase + Prisma) & VALIDASI GAMBAR BARU
    // --------------------------------------------------
    const validNewFiles = newImageFiles.filter(
      (fileItem) => fileItem instanceof File && fileItem.size > 0
    );

    for (const fileItem of validNewFiles) {
      if (fileItem.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `Ukuran file ${fileItem.name} lebih dari 500KB` },
          { status: 400 }
        );
      }

      if (!ALLOWED_TYPES.includes(fileItem.type)) {
        return NextResponse.json(
          { error: `Format file ${fileItem.name} tidak valid` },
          { status: 400 }
        );
      }
    }

    const supabase = getSupabaseAdmin();

    const deleteTask = (async () => {
      if (imagesToDelete.length === 0) return;
      const toRemove = existing.portofolio_images.filter((img) =>
        imagesToDelete.includes(img.id)
      );
      const filePaths = toRemove
        .map((img) => getSupabaseFilePath(img.url))
        .filter((p) => p !== null);

      await Promise.all([
        filePaths.length > 0
          ? supabase.storage.from("portofolio-images").remove(filePaths)
          : Promise.resolve(),
        prisma.portofolio_images.deleteMany({
          where: { id: { in: imagesToDelete } },
        }),
      ]);
    })();

    // --------------------------------------------------
    // 2. UPLOAD GAMBAR BARU SECARA PARALEL
    // --------------------------------------------------
    const uploadTask = Promise.all(
      validNewFiles.map(async (fileItem) => {
        const buffer = Buffer.from(await fileItem.arrayBuffer());
        const ext = fileItem.name.split(".").pop();
        const filename = `${newSlug}-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("portofolio-images")
          .upload(filename, buffer, {
            contentType: fileItem.type,
          });

        if (uploadError) {
          throw new Error(`Gagal upload file ${fileItem.name}`);
        }

        const { data } = supabase.storage
          .from("portofolio-images")
          .getPublicUrl(filename);

        return data?.publicUrl ? { url: data.publicUrl } : null;
      })
    );

    const [, uploadedUrls] = await Promise.all([deleteTask, uploadTask]);
    const newImageUrls = uploadedUrls.filter(Boolean);

    // --------------------------------------------------
    // 3. UPDATE DATABASE
    // --------------------------------------------------
    const updated = await prisma.portofolio.update({
      where: { id },
      data: {
        name: newName,
        slug: newSlug,
        kategori: newKategori,
        type: newType,
        description,
        portofolio_images: {
          create: newImageUrls,
        },
      },
      include: {
        portofolio_images: true,
      },
    });

    revalidateTag("portofolio");

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Gagal update portofolio" }, { status: 500 });
  }
}

// ==========================================================================
// DELETE — HAPUS PORTFOLIO + GAMBAR
// ==========================================================================
export async function DELETE(req, context) {
  try {
    // 🔥 PERBAIKAN: Mengakses context.params.id secara langsung
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.portofolio.findUnique({
      where: { id },
      include: { portofolio_images: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Portofolio tidak ditemukan" }, { status: 404 });
    }

    const filePaths = existing.portofolio_images
      .map((img) => getSupabaseFilePath(img.url))
      .filter((p) => p !== null);

    if (filePaths.length > 0) {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.storage.from("portofolio-images").remove(filePaths);
      if (error) console.warn("Supabase delete warning:", error);
    }

    await prisma.portofolio.delete({ where: { id } });
    revalidateTag("portofolio");

    return NextResponse.json({ message: "Portofolio berhasil dihapus" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus portofolio" }, { status: 500 });
  }
}