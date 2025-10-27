import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    {
      title: "American Style",
      subtitle: "Minimalist Home Decor",
      image: "/images/design/int1.png",
    },
    {
      title: "Desain Kontemporer",
      subtitle: "Minimalist Vibe",
      image: "/images/design/int2.png",
    },
    {
      title: "Ceramics Design",
      subtitle: "Garasi Luas",
      image: "/images/design/int3.png",
    },
    {
      title: "Desain Aersial",
      subtitle: "Kombinasi Natural",
      image: "/images/design/int4.png",
    },
    {
      title: "Scandinavian Living",
      subtitle: "Clean White Space",
      image: "/images/design/int5.png",
    },
    {
      title: "Industrial Loft",
      subtitle: "Steel & Concrete Concept",
      image: "/images/design/int6.png",
    },
    {
      title: "Tropical Harmony",
      subtitle: "Natural Breeze House",
      image: "/images/design/int7.png",
    },
    {
      title: "Modern Japandi",
      subtitle: "Serenity & Functionality",
      image: "/images/design/int8.png",
    },
  ];

  return NextResponse.json(data);
}
