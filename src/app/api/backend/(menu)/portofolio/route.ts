// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import { createClient } from "@supabase/supabase-js";

// // Supabase Client (Tetap sama)
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

// // Helper function untuk slugify (Tetap sama)
// function slugify(text: string): string {
//   return text
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9\-]/g, "");
// }

// // Helper function untuk generate slug unik (Tetap sama)
// async function generateUniqueSlug(name: string) {
//   let baseSlug = slugify(name);
//   let uniqueSlug = baseSlug;
//   let count = 1;

//   while (await prisma.portofolio.findUnique({ where: { slug: uniqueSlug } })) {
//     uniqueSlug = `${baseSlug}-${count++}`;
//   }

//   return uniqueSlug;
// }

// // --- PERUBAHAN 1: UPDATE HANDLER GET (Agar menyertakan relasi 'images') ---

// export async function GET() {
//   try {
//     const portofolio = await prisma.portofolio.findMany({
//       select: {
//         id: true,
//         name: true,
//         slug: true,
//         // Hapus 'image' tunggal
//         description: true,
//         kategori: true,
//         type: true,
//         created_by: true,
//         created_at: true,
//         updated_at: true,
//         // ✅ Tambahkan relasi images untuk diambil
//         portofolio_images: {
//           select: {
//             id: true,
//             url: true,
//           },
//           orderBy: { id: 'asc' }, // Ambil yang pertama untuk preview
//         },
//       },
//       orderBy: { id: "desc" },
//     });

//     return NextResponse.json(portofolio);
//   } catch (error) {
//     console.error("Prisma error (GET):", error);
//     return NextResponse.json(
//       { error: "Failed to fetch portofolio" },
//       { status: 500 }
//     );
//   }
// }

// // --- PERUBAHAN 2: UPDATE HANDLER POST (Untuk multiple files) ---

// export async function POST(request: Request) {
//   const MAX_SIZE = 500 * 1024; // 500 KB
//   const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
//   const createdBy = 1; // TODO: ganti saat sudah pakai auth user session

//   try {
//     const formData = await request.formData();
//     const name = formData.get("name") as string;
//     const description = formData.get("description") as string | null;
//     const kategori = formData.get("kategori") as string;
//     const type = formData.get("type") as string;
    
//     // ✅ AMBIL SEMUA FILE DENGAN KUNCI 'images' (frontend mengirimkannya sebagai array)
//     const imageFiles = formData.getAll("images") as File[];
    
//     // --- Validasi Data Dasar ---
//     if (!name || !kategori || !type) {
//       return NextResponse.json(
//         { error: "Nama, Kategori, dan Tipe wajib diisi" },
//         { status: 400 }
//       );
//     }
    
//     // --- Validasi File ---
//     if (imageFiles.length === 0 || !(imageFiles[0] instanceof File)) {
//       return NextResponse.json(
//         { error: "Minimal satu gambar portofolio wajib diunggah" },
//         { status: 400 }
//       );
//     }

//     for (const imageFile of imageFiles) {
//         if (imageFile.size > MAX_SIZE) {
//             return NextResponse.json(
//               { error: `Ukuran file '${imageFile.name}' maksimal 500 KB` },
//               { status: 400 }
//             );
//         }
//         if (!ALLOWED_TYPES.includes(imageFile.type)) {
//             return NextResponse.json(
//               { error: `Format file '${imageFile.name}' tidak valid (JPG, PNG, WebP saja)` },
//               { status: 400 }
//             );
//         }
//     }

//     // --- Pembuatan Slug ---
//     const slug = await generateUniqueSlug(name);
    
//     // --- Upload Gambar ke Supabase dan Kumpulkan URL ---
//     const imageUrls: { url: string }[] = [];

//     for (const imageFile of imageFiles) {
//       const fileExt = imageFile.name.split(".").pop();
//       // Gunakan slug dan timestamp untuk memastikan nama unik
//       const fileName = `${slug}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

//       const { error: uploadError } = await supabase.storage
//         .from("portofolio-images")
//         .upload(fileName, imageFile);

//       if (uploadError) {
//         console.error("Supabase Upload Error:", uploadError);
//         return NextResponse.json(
//           { error: `Gagal upload gambar: ${imageFile.name}` },
//           { status: 500 }
//         );
//       }

//       const { data: publicUrlData } = supabase.storage
//         .from("portofolio-images")
//         .getPublicUrl(fileName);

//       imageUrls.push({ url: publicUrlData.publicUrl });
//     }
    
//     // --- Simpan Data ke Prisma ---
//     const newPortofolio = await prisma.portofolio.create({
//       data: {
//         name,
//         slug,
//         kategori,
//         type,
//         // Hapus field 'image'
//         description: description || null,
//         created_by: createdBy,
//         // ✅ Relasikan dan Buat semua gambar sekaligus
//         portofolio_images: {
//           create: imageUrls,
//         },
//       },
//       include: {
//         portofolio_images: true,
//       },
//     });

//     return NextResponse.json(newPortofolio, { status: 201 });
//   } catch (error) {
//     console.error("Prisma/General Error (POST):", error);
//     return NextResponse.json(
//       { error: "Failed to create portofolio due to server error." },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

// Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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

export async function GET() {
  try {
    const portofolio = await prisma.portofolio.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        kategori: true,
        type: true,
        created_by: true,
        created_at: true,
        updated_at: true,
        portofolio_images: {
          select: { id: true, url: true },
          orderBy: { id: "asc" },
        },
      },
      orderBy: { id: "desc" },
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

export async function POST(request: Request) {
  const MAX_SIZE = 500 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const createdBy = 1;

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;

    // kategori tidak wajib lagi
    const kategori = (formData.get("kategori") as string) || null;

    // hanya type yang wajib
    const type = formData.get("type") as string;

    const imageFiles = formData.getAll("images") as File[];

    // VALIDASI WAJIB
    if (!name || !type) {
      return NextResponse.json(
        { error: "Nama dan Tipe wajib diisi" },
        { status: 400 }
      );
    }

    if (imageFiles.length === 0 || !(imageFiles[0] instanceof File)) {
      return NextResponse.json(
        { error: "Minimal satu gambar wajib diunggah" },
        { status: 400 }
      );
    }

    for (const imageFile of imageFiles) {
      if (imageFile.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `Ukuran file '${imageFile.name}' maksimal 500 KB` },
          { status: 400 }
        );
      }
      if (!ALLOWED_TYPES.includes(imageFile.type)) {
        return NextResponse.json(
          { error: `Format file '${imageFile.name}' tidak valid (JPG, PNG, WebP saja)` },
          { status: 400 }
        );
      }
    }

    // SLUG
    const slug = await generateUniqueSlug(name);

    // UPLOAD GAMBAR
    const imageUrls: { url: string }[] = [];

    for (const imageFile of imageFiles) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${slug}-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("portofolio-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError);
        return NextResponse.json(
          { error: `Gagal upload gambar: ${imageFile.name}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from("portofolio-images")
        .getPublicUrl(fileName);

      imageUrls.push({ url: publicUrlData.publicUrl });
    }

    // SIMPAN PRISMA
    const newPortofolio = await prisma.portofolio.create({
      data: {
        name,
        slug,
        kategori: kategori || null, // kategori boleh kosong
        type,
        description: description || null,
        created_by: createdBy,
        portofolio_images: {
          create: imageUrls,
        },
      },
      include: {
        portofolio_images: true,
      },
    });

    return NextResponse.json(newPortofolio, { status: 201 });
  } catch (error) {
    console.error("Prisma/General Error (POST):", error);
    return NextResponse.json(
      { error: "Failed to create portofolio due to server error." },
      { status: 500 }
    );
  }
}
