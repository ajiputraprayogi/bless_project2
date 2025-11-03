import { NextResponse } from "next/server";

// dummy sizePattern
const sizePattern = ["small", "medium", "large", "medium", "small"];

export async function GET() {
  try {
    const dbPortofolio = [
      {
        id: 1,
        slug: "project-alpha",
        name: "Project Alpha",
        description: "Deskripsi singkat Project Alpha",
        image: "/images/design/1.png",
      },
      {
        id: 2,
        slug: "project-beta",
        name: "Project Beta",
        description: "Deskripsi singkat Project Beta",
        image: "/images/design/2.png",
      },
      {
        id: 3,
        slug: "project-gamma",
        name: "Project Gamma",
        description: "Deskripsi singkat Project Gamma",
        image: "/images/design/3.png",
      },
      {
        id: 4,
        slug: "project-delta",
        name: "Project Delta",
        description: "Deskripsi singkat Project Delta",
        image: "/images/design/4.png",
      },
      {
        id: 5,
        slug: "project-epsilon",
        name: "Project Epsilon",
        description: "Deskripsi singkat Project Epsilon",
        image: "/images/design/5.png",
      },
    ];

    const projectsWithSize = dbPortofolio.map((proj, idx) => ({
      id: proj.id,
      slug: proj.slug,
      title: proj.name,
      desc: proj.description ?? "",
      img: proj.image ?? "/images/default-image.png",
      size: sizePattern[idx % sizePattern.length],
    }));

    return NextResponse.json(projectsWithSize);
  } catch (error) {
    console.error("Error fetching dummy design:", error);
    return NextResponse.json(
      { error: "Gagal memuat data portofolio dummy" },
      { status: 500 }
    );
  }
}
