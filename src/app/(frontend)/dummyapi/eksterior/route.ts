import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    {
      title: "American Style",
      subtitle: "Minimalist Home Decor",
      image: "/images/design/1.png",
    },
    {
      title: "Desain Kontemporer",
      subtitle: "Minimalist Vibe",
      image: "/images/design/home2.png",
    },
    {
      title: "Ceramics Design",
      subtitle: "Garasi Luas",
      image: "/images/design/home3.jpg",
    },
    {
      title: "Desain Aersial",
      subtitle: "Kombinasi Natural",
      image: "/images/design/home4.png",
    },
    {
      title: "Scandinavian Living",
      subtitle: "Clean White Space",
      image: "/images/design/home5.jpg",
    },
    {
      title: "Industrial Loft",
      subtitle: "Steel & Concrete Concept",
      image: "/images/design/home6.png",
    },
    {
      title: "Tropical Harmony",
      subtitle: "Natural Breeze House",
      image: "/images/design/home7.png",
    },
    {
      title: "Modern Japandi",
      subtitle: "Serenity & Functionality",
      image: "/images/design/home8.png",
    },
  ];

  return NextResponse.json(data);
}
