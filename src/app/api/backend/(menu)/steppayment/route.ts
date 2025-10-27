import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type StepDetail = {
  sub_title: string;
  description: string;
};

// ✅ GET semua step payment beserta detailnya
export async function GET() {
  try {
    const steps = await prisma.payment_step.findMany({
      include: { payment_step_detail: true },
      orderBy: { step_number: "asc" },
    });

    return NextResponse.json(steps);
  } catch (error) {
    console.error("Prisma error (GET PaymentStep):", error);
    return NextResponse.json({ error: "Failed to fetch payment steps" }, { status: 500 });
  }
}

// ✅ POST untuk buat step payment baru beserta detail
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { step_number, title, details }: { step_number: number; title?: string; details: StepDetail[] } = body;

    // Validasi
    if (!step_number || !details || !details.length) {
      return NextResponse.json({ error: "Step number dan details wajib diisi" }, { status: 400 });
    }

    for (const d of details) {
      if (!d.sub_title || !d.description) {
        return NextResponse.json({ error: "Semua sub_title dan description pada details harus diisi" }, { status: 400 });
      }
    }

    // Buat step payment beserta details
    const newStep = await prisma.payment_step.create({
      data: {
        step_number,
        title,
        payment_step_detail: {
          create: details.map(d => ({
            sub_title: d.sub_title,
            description: d.description,
          })),
        },
      },
      include: { payment_step_detail: true },
    });

    return NextResponse.json(newStep, { status: 201 });
  } catch (error) {
    console.error("Prisma error (POST PaymentStep):", error);
    return NextResponse.json({ error: "Failed to create payment step" }, { status: 500 });
  }
}
