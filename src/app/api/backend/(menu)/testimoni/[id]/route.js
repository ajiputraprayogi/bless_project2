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

/**
 * Mendapatkan filename dari URL Supabase berdasarkan field (avatar atau src)
 * @param {string} publicUrl URL publik Supabase
 * @param {'avatar' | 'src'} field Nama field ('avatar' atau 'src')
 * @returns {string | null} Filename jika valid, null jika tidak
 */
function getTestimoniFilePath(publicUrl, field) {
    if (!publicUrl) return null;

    const segments = publicUrl.split("/");
    const filename = segments.pop();
    const bucket = segments[segments.length - 1];

    const expectedBucket = field === 'avatar' ? 'testimoni-avatars' : 'testimoni-src';

    if (bucket === expectedBucket) {
        return filename || null;
    }
    return null;
}

// ==========================================================================
// GET BY ID
// ==========================================================================
/**
 * @param {Request} req
 * @param {{ params: { id: string } }} context
 */
export async function GET(req, context) {
    try {
        const id = parseInt(context.params.id, 10);

        if (isNaN(id)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const testimoni = await prisma.testimoni.findUnique({
            where: { id },
            select: {
                id: true,
                client: true,
                message: true,
                alt: true,
                video: true,
                avatar: true, // URL Avatar
                src: true, // URL Gambar Desain
                // created_by: true, // DIHAPUS
                // created_at: true, // ❌ HARUS DIHAPUS (Berdasarkan skema)
                // updated_at: true, // ❌ HARUS DIHAPUS (Berdasarkan skema)
            },
        });

        if (!testimoni) {
            return NextResponse.json({ error: "Testimoni tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(testimoni, { status: 200 });
    } catch (error) {
        console.error("GET error:", error);
        return NextResponse.json({ error: "Gagal mengambil testimoni" }, { status: 500 });
    }
}

// ==========================================================================
// PATCH — UPDATE TESTIMONI
// ==========================================================================
/**
 * @param {Request} req
 * @param {{ params: { id: string } }} context
 */
export async function PATCH(req, context) {
    try {
        const id = parseInt(context.params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const MAX_SIZE = 500 * 1024;
        const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

        const formData = await req.formData();

        const client = formData.get("client")?.toString() || null;
        const message = formData.get("message")?.toString() || null;
        const alt = formData.get("alt")?.toString() || null;
        const video = formData.get("video")?.toString() || null;
        
        const newAvatarFile = formData.get("new_avatar");
        const newSrcFile = formData.get("new_src");
        const deleteAvatarSignal = formData.get("delete_avatar") === "true";
        const deleteSrcSignal = formData.get("delete_src") === "true";

        const existing = await prisma.testimoni.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Testimoni tidak ditemukan" }, { status: 404 });
        }

        const updateData = {};

        // Validasi dan set data teks
        const newClient = client ?? existing.client;
        const newMessage = message ?? existing.message;

        if (!newClient || !newMessage) {
            return NextResponse.json(
                { error: "Nama Klien dan Pesan wajib diisi" },
                { status: 400 }
            );
        }
        
        updateData.client = newClient;
        updateData.message = newMessage;
        updateData.alt = alt; 
        updateData.video = video;

        // --------------------------------------------------
        // LOGIKA GAMBAR (Avatar dan Src)
        // --------------------------------------------------
        
        const filesToProcess = [
            { field: 'avatar', file: newAvatarFile, deleteSignal: deleteAvatarSignal, existingUrl: existing.avatar },
            { field: 'src', file: newSrcFile, deleteSignal: deleteSrcSignal, existingUrl: existing.src },
        ];
        
        for (const { field, file, deleteSignal, existingUrl } of filesToProcess) {
            const bucketName = field === 'avatar' ? 'testimoni-avatars' : 'testimoni-src';

            // 1. HAPUS GAMBAR LAMA (Jika ada sinyal hapus atau diganti file baru)
            const shouldDeleteExisting = deleteSignal || (file instanceof File);

            if (shouldDeleteExisting && existingUrl) {
                const filePath = getTestimoniFilePath(existingUrl, field);
                if (filePath) {
                    const { error } = await supabase.storage.from(bucketName).remove([filePath]);
                    if (error) console.warn(`Supabase delete warning for ${field}:`, error);
                }
                
                // Set field di database menjadi null jika dihapus dan tidak diganti file baru
                if (deleteSignal && !(file instanceof File)) {
                    updateData[field] = null;
                }
            }

            // 2. UPLOAD GAMBAR BARU (Jika ada file baru)
            if (file instanceof File && file.size > 0) {
                if (file.size > MAX_SIZE) {
                    return NextResponse.json(
                        { error: `Ukuran file ${field} lebih dari 500KB` },
                        { status: 400 }
                    );
                }
                if (!ALLOWED_TYPES.includes(file.type)) {
                    return NextResponse.json(
                        { error: `Format file ${field} tidak valid` },
                        { status: 400 }
                    );
                }

                const buffer = Buffer.from(await file.arrayBuffer());
                const ext = file.name.split(".").pop();
                const filename = `${newClient.toLowerCase().replace(/\s/g, '_')}-${field}-${Date.now()}.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(filename, buffer, { contentType: file.type });

                if (uploadError) {
                    console.error("Upload error:", uploadError);
                    return NextResponse.json(
                        { error: `Gagal upload file ${field}` },
                        { status: 500 }
                    );
                }

                const { data } = supabase.storage.from(bucketName).getPublicUrl(filename);
                if (data?.publicUrl) {
                    updateData[field] = data.publicUrl;
                }
            }
        }
        
        // Penyesuaian akhir untuk memastikan URL lama dipertahankan jika tidak ada perubahan/penghapusan.
        if (updateData.avatar === undefined && existing.avatar && !deleteAvatarSignal && !newAvatarFile) {
            delete updateData.avatar; 
        }
        
        if (updateData.src === undefined && existing.src && !deleteSrcSignal && !newSrcFile) {
            delete updateData.src; 
        }

        // --------------------------------------------------
        // 3. UPDATE DATABASE
        // --------------------------------------------------
        const updated = await prisma.testimoni.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json({ error: "Gagal update testimoni" }, { status: 500 });
    }
}

// ==========================================================================
// DELETE — HAPUS TESTIMONI + GAMBAR
// ==========================================================================
/**
 * @param {Request} req
 * @param {{ params: { id: string } }} context
 */
export async function DELETE(req, context) {
    try {
        const id = parseInt(context.params.id, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const existing = await prisma.testimoni.findUnique({
            where: { id },
            select: { avatar: true, src: true },
        });

        if (!existing) {
            return NextResponse.json({ error: "Testimoni tidak ditemukan" }, { status: 404 });
        }
        
        const filesToDelete = [];

        // Hapus Avatar
        if (existing.avatar) {
            const avatarPath = getTestimoniFilePath(existing.avatar, 'avatar');
            if (avatarPath) filesToDelete.push({ path: avatarPath, bucket: "testimoni-avatars" });
        }

        // Hapus Src
        if (existing.src) {
            const srcPath = getTestimoniFilePath(existing.src, 'src');
            if (srcPath) filesToDelete.push({ path: srcPath, bucket: "testimoni-src" });
        }

        // Eksekusi penghapusan di Supabase Storage
        if (filesToDelete.length > 0) {
            const avatarPaths = filesToDelete.filter(f => f.bucket === 'testimoni-avatars').map(f => f.path);
            const srcPaths = filesToDelete.filter(f => f.bucket === 'testimoni-src').map(f => f.path);
            
            if (avatarPaths.length > 0) {
                const { error } = await supabase.storage.from("testimoni-avatars").remove(avatarPaths);
                if (error) console.warn("Supabase delete warning (avatar):", error);
            }
            if (srcPaths.length > 0) {
                const { error } = await supabase.storage.from("testimoni-src").remove(srcPaths);
                if (error) console.warn("Supabase delete warning (src):", error);
            }
        }

        // Hapus dari Prisma
        await prisma.testimoni.delete({ where: { id } });

        return NextResponse.json({ message: "Testimoni berhasil dihapus" });
    } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json({ error: "Gagal menghapus testimoni" }, { status: 500 });
    }
}