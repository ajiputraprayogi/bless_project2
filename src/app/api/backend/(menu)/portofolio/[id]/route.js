// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db";
// import { createClient } from "@supabase/supabase-js";
// import slugify from "slugify";

// if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
//   throw new Error("Supabase environment variables are missing");
// }

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// // ✅ Ambil detail portofolio
// export async function GET(req, context) {
//   try {
//     const id = parseInt(context.params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
//     }

//     const portofolio = await prisma.portofolio.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         name: true,
//         slug: true,
//         image: true,
//         description: true,
//         // 🟢 Pastikan Kategori dan Tipe diambil untuk form edit
//         kategori: true,
//         type: true,
//         created_by: true,
//         created_at: true,
//       },
//     });

//     if (!portofolio) {
//       return NextResponse.json({ error: "Portofolio tidak ditemukan" }, { status: 404 });
//     }

//     return NextResponse.json(portofolio, { status: 200 });
//   } catch (error) {
//     console.error("Prisma error (GET by ID):", error);
//     return NextResponse.json({ error: "Gagal mengambil portofolio" }, { status: 500 });
//   }
// }

// async function generateUniqueSlugForUpdate(name, id) {
//   const baseSlug = slugify(name, { lower: true, strict: true });
//   let uniqueSlug = baseSlug;
//   let count = 1;

//   while (true) {
//     const existing = await prisma.portofolio.findUnique({
//       where: { slug: uniqueSlug },
//     });

//     if (!existing || existing.id === id) {
//       break;
//     }

//     uniqueSlug = `${baseSlug}-${count++}`;
//   }

//   return uniqueSlug;
// }

// // ✅ Update portofolio
// export async function PUT(req, context) {
//   try {
//     const id = parseInt(context.params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
//     }

//     const formData = await req.formData();
//     // 🟢 AMBIL: Semua field dari FormData
//     const name = formData.get("name")?.toString() || null;
//     const description = formData.get("description")?.toString() || null;
//     const kategori = formData.get("kategori")?.toString() || null;
//     const type = formData.get("type")?.toString() || null;
//     const file = formData.get("image");
    
//     // Konversi file ke tipe yang bisa diproses
//     const imageFile = file instanceof File && file.size > 0 ? file : null;

//     const existing = await prisma.portofolio.findUnique({ where: { id } });
//     if (!existing) {
//       return NextResponse.json({ error: "Portofolio tidak ditemukan" }, { status: 404 });
//     }
    
//     // Tentukan nilai baru, gunakan nilai lama jika nilai baru kosong
//     const newName = name ?? existing.name;
//     const newKategori = kategori ?? existing.kategori;
//     const newType = type ?? existing.type;

//     // 🟢 VALIDASI SERVER: Wajib diisi
//     if (!newName || !newKategori || !newType) {
//         return NextResponse.json(
//             { error: "Nama, Kategori dan Type wajib diisi" },
//             { status: 400 }
//         );
//     }

//     // ✅ Generate slug baru jika name berubah
//     const newSlug = await generateUniqueSlugForUpdate(newName, id);

//     let imageUrl = existing.image;

//     // ✅ Upload file baru jika ada
//     if (imageFile) {
//       // 🔹 Validasi ukuran & tipe file
//       const MAX_SIZE = 500 * 1024; // 500KB
//       const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

//       if (imageFile.size > MAX_SIZE) {
//         return NextResponse.json(
//           { error: "Ukuran file maksimal 500 KB" },
//           { status: 400 }
//         );
//       }

//       if (!ALLOWED_TYPES.includes(imageFile.type)) {
//         return NextResponse.json(
//           { error: "Format file tidak valid. Hanya JPG, PNG, atau WebP" },
//           { status: 400 }
//         );
//       }

//       // 🔹 Hapus file lama di storage
//       if (existing.image) {
//         const urlParts = existing.image.split('/');
//         const oldFilePath = urlParts.pop(); 
//         if (oldFilePath) {
//             const { error: removeError } = await supabase.storage.from("portofolio-images").remove([oldFilePath]);
//             if (removeError) console.warn("Supabase remove warning:", removeError); 
//         }
//       }

//       const buffer = Buffer.from(await imageFile.arrayBuffer());
//       const ext = imageFile.name.split(".").pop();

//       // ✅ Nama file menjadi slug-timestamp.ext
//       const fileName = `${newSlug}-${Date.now()}.${ext}`;
//       const filePath = fileName;

//       const { error: uploadError } = await supabase.storage
//         .from("portofolio-images")
//         .upload(filePath, buffer, { contentType: imageFile.type, upsert: true });

//       if (uploadError) {
//         console.error("Supabase upload error:", uploadError);
//         return NextResponse.json({ error: "Gagal upload file ke Supabase" }, { status: 500 });
//       }

//       const { data } = supabase.storage.from("portofolio-images").getPublicUrl(filePath);
//       if (data?.publicUrl) {
//         imageUrl = data.publicUrl;
//       }
//     }

//     // 🟢 UPDATE: Simpan semua data
//     const updated = await prisma.portofolio.update({
//       where: { id },
//       data: {
//         name: newName,
//         slug: newSlug, 
//         kategori: newKategori, // Update kategori
//         type: newType,         // Update type
//         description: description ?? existing.description,
//         image: imageUrl,
//       },
//     });

//     return NextResponse.json(updated, { status: 200 });
//   } catch (error) {
//     console.error("Prisma error (PUT):", error);
//     return NextResponse.json({ error: "Gagal update portofolio" }, { status: 500 });
//   }
// }

// // ✅ Hapus portofolio
// export async function DELETE(req, context) {
//   try {
//     const id = parseInt(context.params.id, 10);
//     if (isNaN(id)) {
//       return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
//     }

//     const existing = await prisma.portofolio.findUnique({ where: { id } });
//     if (existing?.image) {
//       const urlParts = existing.image.split('/');
//       const oldFilePath = urlParts.pop(); 
//       if (oldFilePath) {
//         await supabase.storage.from("portofolio-images").remove([oldFilePath]);
//       }
//     }

//     await prisma.portofolio.delete({ where: { id } });

//     return NextResponse.json({ message: "Portofolio berhasil dihapus" }, { status: 200 });
//   } catch (error) {
//     console.error("Prisma error (DELETE):", error);
//     return NextResponse.json({ error: "Gagal menghapus portofolio" }, { status: 500 });
//   }
// }


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

// Helper function untuk mendapatkan path file dari URL Supabase
function getSupabaseFilePath(publicUrl) {
    if (!publicUrl) return null;
    const pathSegments = publicUrl.split('/');
    // Nama file selalu menjadi elemen terakhir
    const fileName = pathSegments.pop(); 
    // Folder storage adalah elemen sebelum nama file
    const bucketName = pathSegments[pathSegments.length - 2]; 
    
    // Asumsi bucket name adalah 'portofolio-images'
    if (bucketName === 'portofolio-images') {
        return fileName;
    }
    return null;
}

// Helper function untuk generate slug unik (Tetap sama, hanya menggunakan slugify yang diimpor)
async function generateUniqueSlugForUpdate(name, id) {
  const baseSlug = slugify(name, { lower: true, strict: true });
  let uniqueSlug = baseSlug;
  let count = 1;

  while (true) {
    const existing = await prisma.portofolio.findUnique({
      where: { slug: uniqueSlug },
    });

    if (!existing || existing.id === id) {
      break;
    }

    uniqueSlug = `${baseSlug}-${count++}`;
  }

  return uniqueSlug;
}

// --- PERUBAHAN 1: UPDATE HANDLER GET (Mengambil relasi gambar) ---

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
        // 🔥 Hapus field 'image' tunggal
        description: true,
        kategori: true,
        type: true,
        created_by: true,
        created_at: true,
        // ✅ Ambil array gambar (sesuai nama relasi yang benar)
        portofolio_images: {
            select: {
                id: true,
                url: true,
            },
            orderBy: { id: 'asc' },
        },
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


// --- PERUBAHAN 2: UPDATE HANDLER PUT/PATCH (Mengelola Multiple Images) ---

// ✅ Update portofolio (Menggunakan PATCH yang lebih sesuai)
export async function PATCH(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const MAX_SIZE = 500 * 1024; // 500KB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

    const formData = await req.formData();
    // 🟢 AMBIL: Data teks
    const name = formData.get("name")?.toString() || null;
    const description = formData.get("description")?.toString() || null;
    const kategori = formData.get("kategori")?.toString() || null;
    const type = formData.get("type")?.toString() || null;
    
    // 🔥 AMBIL: Array file baru dan Array ID yang akan dihapus
    const newImageFiles = formData.getAll("new_images"); // Array of File/string
    const imagesToDeleteJson = formData.get("images_to_delete")?.toString();
    const imagesToDelete = imagesToDeleteJson ? JSON.parse(imagesToDeleteJson) : []; // Array of ID

    const existing = await prisma.portofolio.findUnique({ 
        where: { id },
        include: { portofolio_images: true }
    });

    if (!existing) {
      return NextResponse.json({ error: "Portofolio tidak ditemukan" }, { status: 404 });
    }
    
    // Tentukan nilai baru, gunakan nilai lama jika nilai baru kosong
    const newName = name ?? existing.name;
    const newKategori = kategori ?? existing.kategori;
    const newType = type ?? existing.type;

    // 🟢 VALIDASI SERVER: Wajib diisi
    if (!newName || !newKategori || !newType) {
        return NextResponse.json(
            { error: "Nama, Kategori dan Type wajib diisi" },
            { status: 400 }
        );
    }

    // 🔥 VALIDASI: Minimal 1 gambar tersisa
    const imagesCountAfterDelete = existing.portofolio_images.filter(img => !imagesToDelete.includes(img.id)).length;
    if (imagesCountAfterDelete + newImageFiles.length === 0) {
        return NextResponse.json(
            { error: "Portofolio harus memiliki minimal satu gambar." },
            { status: 400 }
        );
    }

    // ✅ Generate slug baru jika name berubah
    const newSlug = await generateUniqueSlugForUpdate(newName, id);

    // --- 1. PROSES PENGHAPUSAN GAMBAR LAMA ---
    if (imagesToDelete.length > 0) {
        const imagesToRemove = existing.portofolio_images.filter(img => imagesToDelete.includes(img.id));
        
        // 🔹 Hapus dari Supabase
        const filePathsToRemove = imagesToRemove.map(img => getSupabaseFilePath(img.url)).filter(p => p !== null);
        if (filePathsToRemove.length > 0) {
            const { error: removeError } = await supabase.storage.from("portofolio-images").remove(filePathsToRemove);
            if (removeError) console.warn("Supabase remove warning:", removeError);
        }

        // 🔹 Hapus dari Prisma
        await prisma.portfolioImage.deleteMany({
            where: { id: { in: imagesToDelete } },
        });
    }

    // --- 2. PROSES UPLOAD DAN CREATE GAMBAR BARU ---
    const newImageUrls = [];
    
    for (const fileItem of newImageFiles) {
        // Pastikan item adalah file yang valid
        if (fileItem instanceof File && fileItem.size > 0) {
            const imageFile = fileItem;

            // 🔹 Validasi ukuran & tipe file baru
            if (imageFile.size > MAX_SIZE) {
                return NextResponse.json(
                  { error: `Ukuran file ${imageFile.name} melebihi batas 500 KB` },
                  { status: 400 }
                );
            }
            if (!ALLOWED_TYPES.includes(imageFile.type)) {
                return NextResponse.json(
                  { error: `Format file ${imageFile.name} tidak valid. Hanya JPG, PNG, atau WebP` },
                  { status: 400 }
                );
            }

            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const ext = imageFile.name.split(".").pop();
            const fileName = `${newSlug}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const filePath = fileName;

            const { error: uploadError } = await supabase.storage
                .from("portofolio-images")
                .upload(filePath, buffer, { contentType: imageFile.type });

            if (uploadError) {
                console.error("Supabase upload error:", uploadError);
                return NextResponse.json({ error: `Gagal upload file ${imageFile.name} ke Supabase` }, { status: 500 });
            }

            const { data } = supabase.storage.from("portofolio-images").getPublicUrl(filePath);
            if (data?.publicUrl) {
                newImageUrls.push({ url: data.publicUrl });
            }
        }
    }

    // --- 3. UPDATE DATA PORTFOLIO UTAMA ---
    const updated = await prisma.portofolio.update({
      where: { id },
      data: {
        name: newName,
        slug: newSlug, 
        kategori: newKategori,
        type: newType,
        description: description, // Deskripsi bisa null atau string baru
        // 🔥 Tambahkan gambar baru ke relasi
        portofolio_images: {
            create: newImageUrls,
        },
      },
        include: {
            portofolio_images: true, // Sertakan relasi untuk hasil response
        }
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PATCH):", error);
    return NextResponse.json({ error: "Gagal update portofolio" }, { status: 500 });
  }
}


// --- PERUBAHAN 3: UPDATE HANDLER DELETE (Menghapus semua gambar terkait) ---

// ✅ Hapus portofolio
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.portofolio.findUnique({ 
        where: { id },
        include: { portofolio_images: true } // Ambil semua gambar
    });
    
    // 🔥 Hapus semua file gambar dari Supabase
    if (existing?.portofolio_images.length > 0) {
        const filePaths = existing.portofolio_images
            .map(img => getSupabaseFilePath(img.url))
            .filter(p => p !== null); 

        if (filePaths.length > 0) {
            // Supabase akan menerima array of file paths
            const { error: removeError } = await supabase.storage.from("portofolio-images").remove(filePaths);
            if (removeError) console.warn("Supabase remove warning during DELETE:", removeError);
        }
    }

    // 🔥 Prisma akan secara otomatis menghapus relasi (cascade delete) jika dikonfigurasi.
    // Jika tidak ada cascade, kita perlu menghapus relasi secara eksplisit:
    // await prisma.portfolioImage.deleteMany({ where: { portofolioId: id } });

    await prisma.portofolio.delete({ where: { id } });

    return NextResponse.json({ message: "Portofolio berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Prisma error (DELETE):", error);
    return NextResponse.json({ error: "Gagal menghapus portofolio" }, { status: 500 });
  }
}