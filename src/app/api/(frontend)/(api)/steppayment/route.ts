// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/db";

// export async function GET() {
//   try {
//     // Ambil semua langkah pembayaran (payment_step)
//     const paymentSteps = await prisma.payment_step.findMany({
//       orderBy: { step_number: "asc" }, // Urutkan berdasarkan nomor langkah
//       select: {
//         id: true,
//         step_number: true,
//         title: true,
//         // Sertakan detail langkah pembayaran (payment_step_detail) yang terkait
//         payment_step_detail: {
//           select: {
//             id: true,
//             sub_title: true,
//             description: true,
//           },
//           orderBy: { id: "asc" }, // Urutkan detail berdasarkan ID atau kriteria lain jika perlu
//         },
//       },
//     });

//     if (!paymentSteps || paymentSteps.length === 0) {
//       return NextResponse.json(
//         { error: "Data langkah pembayaran tidak ditemukan" },
//         { status: 404 }
//       );
//     }

//     // Mengembalikan array dari langkah-langkah pembayaran
//     return NextResponse.json(paymentSteps);
//   } catch (error) {
//     console.error("Error mengambil data langkah pembayaran:", error);
//     return NextResponse.json(
//       { error: "Gagal memuat data langkah pembayaran" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cachedPublicQuery, publicJsonResponse } from "@/lib/cache";

export async function GET() {
  try {
    const formatted = await cachedPublicQuery(
      ["public-steppayment"],
      "steppayment",
      async () => {
        const paymentSteps = await prisma.payment_step.findMany({
          orderBy: { step_number: "asc" },
          select: {
            id: true,
            step_number: true,
            title: true,
            payment_step_detail: {
              orderBy: { id: "asc" },
              select: {
                sub_title: true,
                description: true,
              },
            },
          },
        });

        return paymentSteps.map((step) => ({
          id: step.id,
          title: step.title,
          side: step.step_number % 2 === 1 ? "start" : "end",
          description: step.payment_step_detail.map(
            (d) => d.description || d.sub_title
          ),
        }));
      }
    );

    if (!formatted || formatted.length === 0) {
      return NextResponse.json(
        { error: "Data langkah pembayaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return publicJsonResponse(formatted);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat data langkah pembayaran" },
      { status: 500 }
    );
  }
}
