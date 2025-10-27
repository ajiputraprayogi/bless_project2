import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    {
      title: "Hunian Rumah",
      subtitle: "Minimalist Home Decor",
      image: "/images/design/home1.jpg",
    },
    {
      title: "Kost & Perumahan",
      subtitle: "Minimalist Vibe",
      image: "/images/design/home2.png",
    },
    {
      title: "Villa & Cafe",
      subtitle: "Garasi Luas",
      image: "/images/design/home3.jpg",
    },
    {
      title: "Tempat Ibadah",
      subtitle: "Kombinasi Natural",
      image: "/images/design/home4.png",
    },
        {
      title: "Tempat Umum",
      subtitle: "Garasi Luas",
      image: "/images/design/home3.jpg",
    },
    {
      title: "Interior",
      subtitle: "Kombinasi Natural",
      image: "/images/design/int1.png",
    },
  ];

  return NextResponse.json(data);
}
