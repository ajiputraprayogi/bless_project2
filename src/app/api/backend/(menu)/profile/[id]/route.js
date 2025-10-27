import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ Ambil detail Profile by ID
export async function GET(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id },
      select: {
        id: true,
        sejarah: true,
        visi: true,
        misi: {
          select: { id: true, text: true },
          orderBy: { id: "asc" },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Data Profile tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Prisma error (GET Profile by ID):", error);
    return NextResponse.json(
      { error: "Gagal mengambil data Profile" },
      { status: 500 }
    );
  }
}

// ✅ Update Profile (beserta misi)
export async function PUT(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const body = await req.json();
    const { sejarah, visi, misi } = body;

    const existing = await prisma.profile.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Data Profile tidak ditemukan" },
        { status: 404 }
      );
    }

    // update profile + replace semua misi
    const updated = await prisma.profile.update({
      where: { id },
      data: {
        sejarah: sejarah ?? existing.sejarah,
        visi: visi ?? existing.visi,
        // kalau ada misi baru, hapus semua dulu lalu buat lagi
        ...(Array.isArray(misi) && {
          misi: {
            deleteMany: {}, // hapus semua misi lama
            create: misi.map((text) => ({ text })), // buat ulang
          },
        }),
      },
      include: {
        misi: true,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Prisma error (PUT Profile):", error);
    return NextResponse.json(
      { error: "Gagal update data Profile" },
      { status: 500 }
    );
  }
}

// ✅ Hapus Profile (otomatis hapus misi karena onDelete: Cascade)
export async function DELETE(req, context) {
  try {
    const id = parseInt(context.params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
    }

    const existing = await prisma.profile.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Data Profile tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.profile.delete({ where: { id } });

    return NextResponse.json(
      { message: "Profile berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Prisma error (DELETE Profile):", error);
    return NextResponse.json(
      { error: "Gagal menghapus Profile" },
      { status: 500 }
    );
  }
}
