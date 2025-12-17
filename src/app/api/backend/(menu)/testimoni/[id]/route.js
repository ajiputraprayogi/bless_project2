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

// ======================================================
// Helper Supabase
// ======================================================
function getTestimoniFilePath(publicUrl, field) {
    if (!publicUrl) return null;

    const segments = publicUrl.split("/");
    const filename = segments.pop();
    const bucket = segments[segments.length - 1];

    const expectedBucket =
        field === "avatar" ? "testimoni-avatars" : "testimoni-src";

    if (bucket === expectedBucket) return filename || null;

    return null;
}

// ======================================================
// GET
// ======================================================
export async function GET(req, context) {
    try {
        const { id } = await context.params;
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const testimoni = await prisma.testimoni.findUnique({
            where: { id: numericId },
            select: {
                id: true,
                client: true,
                message: true,
                alt: true,
                video: true,
                avatar: true,
                src: true,
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

// ======================================================
// PATCH
// ======================================================
export async function PATCH(req, context) {
    try {
        const { id } = await context.params;
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
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
            where: { id: numericId },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Testimoni tidak ditemukan" },
                { status: 404 }
            );
        }

        const updateData = {};

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

        // ======================================================
        // FILE HANDLING
        // ======================================================
        const fileFields = [
            { field: "avatar", file: newAvatarFile, delete: deleteAvatarSignal, existing: existing.avatar },
            { field: "src", file: newSrcFile, delete: deleteSrcSignal, existing: existing.src },
        ];

        for (const { field, file, delete: del, existing } of fileFields) {
            const bucketName = field === "avatar" ? "testimoni-avatars" : "testimoni-src";
            const isNewFile = file instanceof File;
            const shouldDelete = del || isNewFile;

            if (shouldDelete && existing) {
                const path = getTestimoniFilePath(existing, field);
                if (path) {
                    await supabase.storage.from(bucketName).remove([path]);
                }

                if (del && !isNewFile) {
                    updateData[field] = null;
                }
            }

            if (isNewFile && file.size > 0) {
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
                const filename =
                    `${newClient.toLowerCase().replace(/\s/g, "_")}-${field}-${Date.now()}.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(filename, buffer, { contentType: file.type });

                if (uploadError) {
                    return NextResponse.json(
                        { error: `Gagal upload file ${field}` },
                        { status: 500 }
                    );
                }

                const { data } =
                    supabase.storage.from(bucketName).getPublicUrl(filename);

                updateData[field] = data.publicUrl;
            }
        }

        const updated = await prisma.testimoni.update({
            where: { id: numericId },
            data: updateData,
        });

        return NextResponse.json(updated, { status: 200 });

    } catch (error) {
        console.error("PATCH error:", error);
        return NextResponse.json({ error: "Gagal update testimoni" }, { status: 500 });
    }
}

// ======================================================
// DELETE
// ======================================================
export async function DELETE(req, context) {
    try {
        const { id } = await context.params;
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
        }

        const existing = await prisma.testimoni.findUnique({
            where: { id: numericId },
            select: { avatar: true, src: true },
        });

        if (!existing) {
            return NextResponse.json({ error: "Testimoni tidak ditemukan" }, { status: 404 });
        }

        const files = [];

        if (existing.avatar) {
            const p = getTestimoniFilePath(existing.avatar, "avatar");
            if (p) files.push({ bucket: "testimoni-avatars", path: p });
        }

        if (existing.src) {
            const p = getTestimoniFilePath(existing.src, "src");
            if (p) files.push({ bucket: "testimoni-src", path: p });
        }

        for (const f of files) {
            await supabase.storage.from(f.bucket).remove([f.path]);
        }

        await prisma.testimoni.delete({ where: { id: numericId } });

        return NextResponse.json(
            { message: "Testimoni berhasil dihapus" },
            { status: 200 }
        );

    } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json({ error: "Gagal menghapus testimoni" }, { status: 500 });
    }
}
