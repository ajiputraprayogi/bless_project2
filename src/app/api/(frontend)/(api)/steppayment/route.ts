import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Ambil semua langkah pembayaran (payment_step)
    const paymentSteps = await prisma.payment_step.findMany({
      orderBy: { step_number: "asc" }, // Urutkan berdasarkan nomor langkah
      select: {
        id: true,
        step_number: true,
        title: true,
        // Sertakan detail langkah pembayaran (payment_step_detail) yang terkait
        payment_step_detail: {
          select: {
            id: true,
            sub_title: true,
            description: true,
          },
          orderBy: { id: "asc" }, // Urutkan detail berdasarkan ID atau kriteria lain jika perlu
        },
      },
    });

    if (!paymentSteps || paymentSteps.length === 0) {
      return NextResponse.json(
        { error: "Data langkah pembayaran tidak ditemukan" },
        { status: 404 }
      );
    }

    // Mengembalikan array dari langkah-langkah pembayaran
    return NextResponse.json(paymentSteps);
  } catch (error) {
    console.error("Error mengambil data langkah pembayaran:", error);
    return NextResponse.json(
      { error: "Gagal memuat data langkah pembayaran" },
      { status: 500 }
    );
  }
}