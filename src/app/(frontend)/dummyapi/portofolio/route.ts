import { NextResponse } from "next/server";

const sizePattern = ["small", "medium", "large", "medium", "small"];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get("type");

    const portfolioDB = [
      {
        id: 1,
        slug: "villa-savana",
        name: "Villa Savana",
        description: "Hunian tropis modern dengan konsep terbuka dan pencahayaan alami maksimal.",
        image: "/images/design/1.png",
        type: "rumah",
      },
      {
        id: 2,
        slug: "apartemen-lumine",
        name: "Apartemen Lumine",
        description: "Desain interior minimalis untuk apartemen studio yang fungsional dan elegan.",
        image: "/images/design/2.png",
        type: "interior",
      },
      {
        id: 3,
        slug: "green-office-park",
        name: "Green Office Park",
        description: "Bangunan komersial ramah lingkungan dengan facade kaca dan taman vertikal.",
        image: "/images/design/3.png",
        type: "komersial",
      },
      {
        id: 4,
        slug: "motion-expo-2025",
        name: "Motion Expo 2025",
        description: "Animasi visual interaktif untuk pameran arsitektur digital di Jakarta.",
        image: "/images/design/4.png",
        type: "animasi",
      },
      {
        id: 5,
        slug: "skyline-residence",
        name: "Skyline Residence",
        description: "Rumah dua lantai bergaya kontemporer dengan rooftop view panorama kota.",
        image: "/images/design/5.png",
        type: "rumah",
      },
      {
        id: 6,
        slug: "casa-aurora",
        name: "Casa Aurora",
        description: "Interior hangat bergaya skandinavia dengan kombinasi kayu alami dan warna netral.",
        image: "/images/design/6.png",
        type: "interior",
      },
      {
        id: 7,
        slug: "metro-tower",
        name: "Metro Tower",
        description: "Gedung perkantoran futuristik dengan sistem efisiensi energi otomatis.",
        image: "/images/design/7.png",
        type: "komersial",
      },
      {
        id: 8,
        slug: "future-motion-lab",
        name: "Future Motion Lab",
        description: "Animasi 3D arsitektur yang menampilkan transisi bentuk bangunan dinamis.",
        image: "/images/design/8.png",
        type: "animasi",
      },
      {
        id: 9,
        slug: "eco-housing-project",
        name: "Eco Housing Project",
        description: "Cluster perumahan berkelanjutan dengan panel surya dan area hijau terbuka.",
        image: "/images/design/9.png",
        type: "konstruksi",
      },
      {
        id: 10,
        slug: "atelier-serenity",
        name: "Atelier Serenity",
        description: "Studio seni bergaya industrial dengan sentuhan unfinished yang artistik.",
        image: "/images/design/10.png",
        type: "interior",
      },
      {
        id: 11,
        slug: "urban-courtyard",
        name: "Urban Courtyard",
        description: "Desain courtyard urban dengan elemen air dan pencahayaan alami.",
        image: "/images/design/11.png",
        type: "rumah",
      },
      {
        id: 12,
        slug: "marina-hub",
        name: "Marina Hub",
        description: "Kompleks bisnis di tepi laut dengan arsitektur bergaya kontemporer maritim.",
        image: "/images/design/12.png",
        type: "komersial",
      },
      {
        id: 13,
        slug: "cultural-heritage-center",
        name: "Cultural Heritage Center",
        description: "Pusat kebudayaan dengan perpaduan arsitektur tradisional dan teknologi modern.",
        image: "/images/design/13.png",
        type: "konstruksi",
      },
      {
        id: 14,
        slug: "sunrise-loft",
        name: "Sunrise Loft",
        description: "Apartemen loft dua tingkat dengan pencahayaan alami dan nuansa kayu.",
        image: "/images/design/14.png",
        type: "interior",
      },
      {
        id: 15,
        slug: "motion-brand-reveal",
        name: "Motion Brand Reveal",
        description: "Animasi brand identity 3D untuk kampanye visual arsitektur modern.",
        image: "/images/design/15.png",
        type: "animasi",
      },
      {
        id: 16,
        slug: "zen-garden-house",
        name: "Zen Garden House",
        description: "Rumah bergaya Jepang dengan taman kering dan pencahayaan lembut.",
        image: "/images/design/16.png",
        type: "rumah",
      },
      {
        id: 17,
        slug: "summit-tower",
        name: "Summit Tower",
        description: "Gedung tinggi berkonsep smart-building dengan sistem ventilasi alami.",
        image: "/images/design/17.png",
        type: "komersial",
      },
      {
        id: 18,
        slug: "aurora-interior-suite",
        name: "Aurora Interior Suite",
        description: "Desain interior premium untuk hotel bintang lima dengan nuansa gold-modern.",
        image: "/images/design/18.png",
        type: "interior",
      },
      {
        id: 19,
        slug: "harbor-point-complex",
        name: "Harbor Point Complex",
        description: "Pusat komersial multifungsi dengan area retail, kantor, dan rooftop lounge.",
        image: "/images/design/19.png",
        type: "konstruksi",
      },
      {
        id: 20,
        slug: "motion-showcase",
        name: "Motion Showcase",
        description: "Showreel animasi arsitektur yang menampilkan proyek-proyek unggulan.",
        image: "/images/design/20.png",
        type: "animasi",
      },
      {
        id: 21,
        slug: "lakeview-villa",
        name: "Lakeview Villa",
        description: "Villa tepi danau dengan fasad kaca penuh untuk menikmati panorama alam.",
        image: "/images/design/21.png",
        type: "rumah",
      },
      {
        id: 22,
        slug: "aurora-office-space",
        name: "Aurora Office Space",
        description: "Desain kantor modern dengan open space dan aksen natural.",
        image: "/images/design/22.png",
        type: "interior",
      },
      {
        id: 23,
        slug: "metropolis-center",
        name: "Metropolis Center",
        description: "Pusat bisnis perkotaan dengan struktur baja ringan dan konsep green design.",
        image: "/images/design/23.png",
        type: "komersial",
      },
    ];

    // ✅ Filter berdasarkan query ?type=
    const filtered = typeFilter
      ? portfolioDB.filter((proj) => proj.type === typeFilter)
      : portfolioDB;

    const projectsWithSize = filtered.map((proj, idx) => ({
      id: proj.id,
      slug: proj.slug,
      title: proj.name,
      desc: proj.description ?? "",
      img: proj.image ?? "/images/default-image.png",
      size: sizePattern[idx % sizePattern.length],
      type: proj.type,
    }));

    return NextResponse.json(projectsWithSize);
  } catch (error) {
    console.error("Error fetching dummy portfolio:", error);
    return NextResponse.json(
      { error: "Gagal memuat data portofolio dummy" },
      { status: 500 }
    );
  }
}
