import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ GET untuk ambil semua FAQ
export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      select: {
        id: true,
        question: true,
        answer: true,
        sortOrder: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Prisma error (GET FAQ):", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQ" },
      { status: 500 }
    );
  }
}

// ✅ POST untuk buat FAQ baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, answer, sortOrder } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Pertanyaan dan jawaban wajib diisi" },
        { status: 400 }
      );
    }

    const newFaq = await prisma.faq.create({
      data: {
        question,
        answer,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json(newFaq, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST FAQ):", error);
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}
