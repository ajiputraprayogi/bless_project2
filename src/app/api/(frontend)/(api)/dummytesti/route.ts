import { NextResponse } from "next/server";

export async function GET() {
  // dummy sederhana, sesuai request kamu
  const data = [
    {
      id: 1,
      client: "Andi Pratama",
      message: "Pelayanannya cepat dan hasilnya sangat memuaskan!",
    },
    {
      id: 2,
      client: "Siti Rahma",
      message: "Desainnya rapi, komunikatif, dan sesuai ekspektasi.",
    },
    {
      id: 3,
      client: "Budi Santoso",
      message: "Recommended banget buat project jangka panjang.",
    },
  ];

  return NextResponse.json(data);
}
