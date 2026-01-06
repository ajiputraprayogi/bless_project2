import { NextResponse } from "next/server";

export async function GET() {
  // dummy sederhana, sesuai request kamu
  const data = [
  { "link": "https://youtu.be/VWSvMVS0iS8?si=raNTKI2a7MvT86ig" },
  { "link": "https://youtu.be/VWSvMVS0iS8?si=raNTKI2a7MvT86ig" }
];


  return NextResponse.json(data);
}
