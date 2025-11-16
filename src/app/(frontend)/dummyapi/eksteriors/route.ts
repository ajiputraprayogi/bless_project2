import { NextResponse } from "next/server";

// Dummy data portfolio
const portfolioDB = [
  {
    id: 1,
    slug: "aurora-interior-suite",
    name: "Rumah Pak Bayan",
    description:
      "Desain interior premium untuk hotel bintang lima dengan nuansa gold-modern.",
    images: [
      "/images/design/1.png",
      "/images/design/2.png",
      "/images/design/3.png",
    ],
    type: "arsitek",
  },
  {
    id: 2,
    slug: "harbor-point-complex",
    name: "Rumah Pak Hugo",
    description:
      "Pusat komersial multifungsi dengan area retail, kantor, dan rooftop lounge.",
    images: [
      "/images/design/4.png",
      "/images/design/5.png",
      "/images/design/6.png",
    ],
    type: "kontraktor",
  },
  {
    id: 3,
    slug: "motion-showcase",
    name: "Rumah Ibu Isti",
    description:
      "Showreel animasi arsitektur yang menampilkan proyek-proyek unggulan.",
    images: [
      "/images/design/7.png",
      "/images/design/8.png",
      "/images/design/9.png",
    ],
    type: "furnitur",
  },
  {
    id: 4,
    slug: "lakeview-villa",
    name: "Rumah Pak Hasan",
    description:
      "Villa tepi danau dengan fasad kaca penuh untuk menikmati panorama alam.",
    images: [
      "/images/design/10.png",
      "/images/design/11.png",
      "/images/design/12.png",
    ],
    type: "arsitek",
  },
  {
    id: 5,
    slug: "aurora-office-space",
    name: "Rumah Kak Icha",
    description:
      "Desain kantor modern dengan open space dan aksen natural.",
    images: [
      "/images/design/13.png",
      "/images/design/14.png",
      "/images/design/15.png",
    ],
    type: "kontraktor",
  },
  {
    id: 6,
    slug: "metropolis-center",
    name: "Rumah Kak Seto",
    description:
      "Pusat bisnis perkotaan dengan struktur baja ringan dan konsep green design.",
    images: [
      "/images/design/16.png",
      "/images/design/17.png",
      "/images/design/18.png",
    ],
    type: "furnitur",
  },
    {
    id: 7,
    slug: "aurora-interior-suite",
    name: "Rumah Kak Alex",
    description:
      "Desain interior premium untuk hotel bintang lima dengan nuansa gold-modern.",
    images: [
      "/images/design/1.png",
      "/images/design/2.png",
      "/images/design/3.png",
    ],
    type: "arsitek",
  },
  {
    id: 8,
    slug: "harbor-point-complex",
    name: "Rumah Pak Joko",
    description:
      "Pusat komersial multifungsi dengan area retail, kantor, dan rooftop lounge.",
    images: [
      "/images/design/4.png",
      "/images/design/5.png",
      "/images/design/6.png",
    ],
    type: "kontraktor",
  },
  {
    id: 9,
    slug: "motion-showcase",
    name: "Rumah Pak Rudi",
    description:
      "Showreel animasi arsitektur yang menampilkan proyek-proyek unggulan.",
    images: [
      "/images/design/7.png",
      "/images/design/8.png",
      "/images/design/9.png",
    ],
    type: "furnitur",
  },
   {
    id: 10,
    slug: "aurora-office-space",
    name: "Rumah Pak Leman",
    description:
      "Desain kantor modern dengan open space dan aksen natural.",
    images: [
      "/images/design/13.png",
      "/images/design/14.png",
      "/images/design/15.png",
    ],
    type: "kontraktor",
  },
  {
    id: 11,
    slug: "metropolis-center",
    name: "Rumah Ibu Sari",
    description:
      "Pusat bisnis perkotaan dengan struktur baja ringan dan konsep green design.",
    images: [
      "/images/design/16.png",
      "/images/design/17.png",
      "/images/design/18.png",
    ],
    type: "furnitur",
  },
    {
    id: 12,
    slug: "aurora-interior-suite",
    name: "Rumah Pak Helman",
    description:
      "Desain interior premium untuk hotel bintang lima dengan nuansa gold-modern.",
    images: [
      "/images/design/1.png",
      "/images/design/2.png",
      "/images/design/3.png",
    ],
    type: "arsitek",
  },
  {
    id: 13,
    slug: "harbor-point-complex",
    name: "Rumah Pak Budi",
    description:
      "Pusat komersial multifungsi dengan area retail, kantor, dan rooftop lounge.",
    images: [
      "/images/design/4.png",
      "/images/design/5.png",
      "/images/design/6.png",
    ],
    type: "kontraktor",
  },
  {
    id: 14,
    slug: "motion-showcase",
    name: "Rumah Pak Hotman",
    description:
      "Showreel animasi arsitektur yang menampilkan proyek-proyek unggulan.",
    images: [
      "/images/design/7.png",
      "/images/design/8.png",
      "/images/design/9.png",
    ],
    type: "furnitur",
  },
    {
    id: 15,
    slug: "aurora-interior-suite",
    name: "Rumah Pak Daniel",
    description:
      "Desain interior premium untuk hotel bintang lima dengan nuansa gold-modern.",
    images: [
      "/images/design/3.png",
      "/images/design/1.png",
      "/images/design/3.png",
    ],
    type: "arsitek",
  },    {
    id: 16,
    slug: "aurora-interior-suite",
    name: "Rumah Pak Daniel",
    description:
      "Desain interior premium untuk hotel bintang lima dengan nuansa gold-modern.",
    images: [
      "/images/design/3.png",
      "/images/design/1.png",
      "/images/design/3.png",
    ],
    type: "komersial",
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get("type");

    // Filter data sesuai tipe (?type=furnitur / ?type=arsitek / ?type=kontraktor)
    const filtered = typeFilter
      ? portfolioDB.filter((proj) => proj.type === typeFilter)
      : portfolioDB;

    // Format respons untuk komponen React
    const projects = filtered.map((proj) => ({
      id: proj.id,
      title: proj.name,
      subtitle: proj.description,
      image: proj.images[0], // tampilan thumbnail default
      images: proj.images, // tambahan untuk gallery
      type: proj.type,
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Gagal memuat data portofolio" },
      { status: 500 }
    );
  }
}
