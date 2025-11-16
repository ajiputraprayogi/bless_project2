import { NextResponse } from "next/server";

// Dummy data portfolio
const portfolioDB = [

  {
    id: 2,
    slug: "harbor-point-complex",
    name: "Rumah Pak Hugo",
    description:
      "Pusat komersial multifungsi dengan area retail, kantor, dan rooftop lounge.",
    images: [
      "/images/design/int34.png",
      "/images/design/int35.png",
      "/images/design/int36.png",
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
      "/images/design/eks7.png",
      "/images/design/eks8.png",
      "/images/design/eks9.png",
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
      "/images/design/eks10.png",
      "/images/design/eks11.png",
      "/images/design/eks12.png",
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
      "/images/design/eks13.png",
      "/images/design/eks14.png",
      "/images/design/eks15.png",
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
      "/images/design/eks16.png",
      "/images/design/eks17.png",
      "/images/design/eks18.png",
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
  // === INTERIOR → FURNITUR (15 item) ===
{
  id: 17,
  slug: "interior-1",
  name: "Interior Project 1",
  description: "Desain interior modern dengan nuansa soft minimalis.",
  images: [
    "/images/design/int1.png",
    "/images/design/int2.png",
    "/images/design/int3.png"
  ],
  type: "furnitur",
},
{
  id: 18,
  slug: "interior-2",
  name: "Interior Project 2",
  description: "Interior hangat dengan sentuhan kayu dan pencahayaan ambient.",
  images: [
    "/images/design/int2.png",
    "/images/design/int3.png",
    "/images/design/int4.png"
  ],
  type: "furnitur",
},
{
  id: 19,
  slug: "interior-3",
  name: "Interior Project 3",
  description: "Ruang keluarga minimalis dengan layout terbuka.",
  images: [
    "/images/design/int3.png",
    "/images/design/int4.png",
    "/images/design/int5.png"
  ],
  type: "furnitur",
},
{
  id: 20,
  slug: "interior-4",
  name: "Interior Project 4",
  description: "Desain kamar tidur elegan dengan tone warna soft white.",
  images: [
    "/images/design/int4.png",
    "/images/design/int5.png",
    "/images/design/int6.png"
  ],
  type: "furnitur",
},
{
  id: 21,
  slug: "interior-5",
  name: "Interior Project 5",
  description: "Konsep ruang kerja clean dan produktif.",
  images: [
    "/images/design/int5.png",
    "/images/design/int6.png",
    "/images/design/int7.png"
  ],
  type: "furnitur",
},
{
  id: 22,
  slug: "interior-6",
  name: "Interior Project 6",
  description: "Interior dapur minimalis dengan kabinet modern.",
  images: [
    "/images/design/int6.png",
    "/images/design/int7.png",
    "/images/design/int8.png"
  ],
  type: "furnitur",
},
{
  id: 23,
  slug: "interior-7",
  name: "Interior Project 7",
  description: "Ruang tamu modern dengan perpaduan warna beige dan gold.",
  images: [
    "/images/design/int7.png",
    "/images/design/int8.png",
    "/images/design/int9.png"
  ],
  type: "furnitur",
},
{
  id: 24,
  slug: "interior-8",
  name: "Interior Project 8",
  description: "Interior minimalis nordic dengan tone putih-kayu.",
  images: [
    "/images/design/int8.png",
    "/images/design/int9.png",
    "/images/design/int10.png"
  ],
  type: "furnitur",
},
{
  id: 25,
  slug: "interior-9",
  name: "Interior Project 9",
  description: "Konsep cafe indoor bergaya industrial light.",
  images: [
    "/images/design/int9.png",
    "/images/design/int10.png",
    "/images/design/int11.png"
  ],
  type: "furnitur",
},
{
  id: 26,
  slug: "interior-10",
  name: "Interior Project 10",
  description: "Ruang santai dengan konsep earthy warm.",
  images: [
    "/images/design/int10.png",
    "/images/design/int11.png",
    "/images/design/int12.png"
  ],
  type: "furnitur",
},
{
  id: 27,
  slug: "interior-11",
  name: "Interior Project 11",
  description: "Interior modern luxury dengan aksen marble.",
  images: [
    "/images/design/int11.png",
    "/images/design/int12.png",
    "/images/design/int13.png"
  ],
  type: "furnitur",
},
{
  id: 28,
  slug: "interior-12",
  name: "Interior Project 12",
  description: "Desain ruang tamu stylish dengan panel kayu vertikal.",
  images: [
    "/images/design/int12.png",
    "/images/design/int13.png",
    "/images/design/int14.png"
  ],
  type: "furnitur",
},
{
  id: 29,
  slug: "interior-13",
  name: "Interior Project 13",
  description: "Interior apartemen compact dengan layout efisien.",
  images: [
    "/images/design/int13.png",
    "/images/design/int14.png",
    "/images/design/int15.png"
  ],
  type: "furnitur",
},
{
  id: 30,
  slug: "interior-14",
  name: "Interior Project 14",
  description: "Lobby modern dengan pencahayaan LED indirect.",
  images: [
    "/images/design/int14.png",
    "/images/design/int15.png",
    "/images/design/int1.png"
  ],
  type: "furnitur",
},
{
  id: 31,
  slug: "interior-15",
  name: "Interior Project 15",
  description: "Desain ruang baca dengan konsep calm minimalist.",
  images: [
    "/images/design/int15.png",
    "/images/design/int1.png",
    "/images/design/int2.png"
  ],
  type: "furnitur",
},


// === EKSTERIOR → ARSITEK (15 item) ===
{
  id: 32,
  slug: "eksterior-1",
  name: "Eksterior Project 1",
  description: "Fasad rumah modern dengan garis geometris.",
  images: [
    "/images/design/eks1.png",
    "/images/design/eks2.png",
    "/images/design/eks3.png"
  ],
  type: "arsitek",
},
{
  id: 33,
  slug: "eksterior-2",
  name: "Eksterior Project 2",
  description: "Tampilan rumah tropis dengan aksen kayu natural.",
  images: [
    "/images/design/eks2.png",
    "/images/design/eks3.png",
    "/images/design/eks4.png"
  ],
  type: "arsitek",
},
{
  id: 34,
  slug: "eksterior-3",
  name: "Eksterior Project 3",
  description: "Desain halaman depan minimalis modern.",
  images: [
    "/images/design/eks3.png",
    "/images/design/eks4.png",
    "/images/design/eks5.png"
  ],
  type: "arsitek",
},
{
  id: 35,
  slug: "eksterior-4",
  name: "Eksterior Project 4",
  description: "Rumah mewah dengan jendela besar panorama view.",
  images: [
    "/images/design/eks4.png",
    "/images/design/eks5.png",
    "/images/design/eks6.png"
  ],
  type: "arsitek",
},
{
  id: 36,
  slug: "eksterior-5",
  name: "Eksterior Project 5",
  description: "Fasad rumah industrial bergaya urban.",
  images: [
    "/images/design/eks5.png",
    "/images/design/eks6.png",
    "/images/design/eks7.png"
  ],
  type: "arsitek",
},
{
  id: 37,
  slug: "eksterior-6",
  name: "Eksterior Project 6",
  description: "Rumah kontemporer 2 lantai.",
  images: [
    "/images/design/eks6.png",
    "/images/design/eks7.png",
    "/images/design/eks8.png"
  ],
  type: "arsitek",
},
{
  id: 38,
  slug: "eksterior-7",
  name: "Eksterior Project 7",
  description: "Desain teras depan minimalis modern.",
  images: [
    "/images/design/eks7.png",
    "/images/design/eks8.png",
    "/images/design/eks9.png"
  ],
  type: "arsitek",
},
{
  id: 39,
  slug: "eksterior-8",
  name: "Eksterior Project 8",
  description: "Eksterior bergaya resort tropis.",
  images: [
    "/images/design/eks8.png",
    "/images/design/eks9.png",
    "/images/design/eks10.png"
  ],
  type: "arsitek",
},
{
  id: 40,
  slug: "eksterior-9",
  name: "Eksterior Project 9",
  description: "Rumah klasik modern dengan garis elegan.",
  images: [
    "/images/design/eks9.png",
    "/images/design/eks10.png",
    "/images/design/eks11.png"
  ],
  type: "arsitek",
},
{
  id: 41,
  slug: "eksterior-10",
  name: "Eksterior Project 10",
  description: "Eksterior rumah minimalis cluster.",
  images: [
    "/images/design/eks10.png",
    "/images/design/eks11.png",
    "/images/design/eks12.png"
  ],
  type: "arsitek",
},
{
  id: 42,
  slug: "eksterior-11",
  name: "Eksterior Project 11",
  description: "Desain pagar dan fasad clean modern.",
  images: [
    "/images/design/eks11.png",
    "/images/design/eks12.png",
    "/images/design/eks13.png"
  ],
  type: "arsitek",
},
{
  id: 43,
  slug: "eksterior-12",
  name: "Eksterior Project 12",
  description: "Rumah modern kotak dengan garis tegas.",
  images: [
    "/images/design/eks12.png",
    "/images/design/eks13.png",
    "/images/design/eks14.png"
  ],
  type: "arsitek",
},
{
  id: 44,
  slug: "eksterior-13",
  name: "Eksterior Project 13",
  description: "Fasad rumah konsep putih bersih.",
  images: [
    "/images/design/eks13.png",
    "/images/design/eks14.png",
    "/images/design/eks15.png"
  ],
  type: "arsitek",
},
{
  id: 45,
  slug: "eksterior-14",
  name: "Eksterior Project 14",
  description: "Desain halaman luas dengan carport modern.",
  images: [
    "/images/design/eks14.png",
    "/images/design/eks15.png",
    "/images/design/eks1.png"
  ],
  type: "arsitek",
},
{
  id: 46,
  slug: "eksterior-15",
  name: "Eksterior Project 15",
  description: "Rumah modern futuristik dengan pencahayaan LED.",
  images: [
    "/images/design/eks15.png",
    "/images/design/eks1.png",
    "/images/design/eks2.png"
  ],
  type: "arsitek",
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
      slug: proj.slug,
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
