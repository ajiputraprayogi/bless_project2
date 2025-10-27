import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ GET: Ambil data kontak berdasarkan ID
export async function GET(req, { params }) {
  try {
    const id = Number(params.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const contact = await prisma.kontak.findUnique({ where: { id } });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error("GET /kontak/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 });
  }
}

// ✅ PUT: Update data kontak berdasarkan ID
export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { platform, url, icon, order, is_active } = body;

    const updatedContact = await prisma.kontak.update({
      where: { id },
      data: { platform, url, icon, order, is_active },
    });

    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error("PUT /kontak/[id] error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

// ✅ DELETE: Hapus data kontak berdasarkan ID
export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await prisma.kontak.delete({ where: { id } });

    return NextResponse.json({ message: "Contact deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /kontak/[id] error:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
