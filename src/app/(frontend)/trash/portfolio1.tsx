"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

interface PortfolioItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  image?: string;
  images: string[];
  type: string;
}

const filterButtons = [
  { label: "Semua", type: "all", href: "/" },
  { label: "Desain Arsitek", type: "arsitek", href: "/desainarsitek" },
  { label: "Jasa Kontraktor", type: "kontraktor", href: "/desainkontraktor" },
  { label: "Interior & Furniture", type: "furnitur", href: "/desaininterior" },
  { label: "Komersial", type: "komersial", href: "/desainkomersial" },
  { label: "Animasi 3D", type: "animasi", href: "/desainanimasi" },
];


export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");

  // Ambil filter sebelumnya
  // useEffect(() => {
  //   const saved = sessionStorage.getItem("lastType");
  //   if (saved) setActiveType(saved);
  // }, []);

  async function fetchData(type: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `api/portofolio/eksteriors${type !== "all" ? "?type=" + type : ""}`
      );

      if (!res.ok) throw new Error("Gagal mengambil data");

      const data: PortfolioItem[] = await res.json();

      let finalData: PortfolioItem[] = [];

      if (type === "all") {
        // Ambil 1 item masing-masing tipe sesuai urutan filterButtons
        const typeOrder = filterButtons.map((btn) => btn.type);

        typeOrder.forEach((t) => {
          if (t === "all") return;

          const found = data.find((item) => item.type === t);
          if (found) finalData.push(found);
        });
      } else {
        // Mode filter biasa: ambil max 5 + urut
        const limited = data.slice(0, 5);
        const typeOrder = filterButtons.map((btn) => btn.type);

        finalData = limited.sort(
          (a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type)
        );
      }

      setPortfolios(finalData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchData(activeType);
  }, [activeType]);

  // Label tipe
  const typeLabelMap: Record<string, string> = {
    arsitek: "Desain Arsitek",
    kontraktor: "Jasa Kontraktor",
    furnitur: "Interior & Furniture",
    komersial: "Komersial",
    animasi: "Animasi 3D",
    all: "Semua",
  };

  // Mapping type → URL
  const typeUrlMap: Record<string, string> = {
    arsitek: "/desainarsitek",
    kontraktor: "/desainkontraktor",
    furnitur: "/desaininterior",
    komersial: "/desainkomersial",
    animasi: "/desainanimasi",
    all: "/", // fallback
  };

  return (
    <main className="min-h-screen bg-black py-20 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm tracking-[3px] text-white uppercase">
          Koleksi Desain
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-yellow-400">
          Portofolio Bless
        </h1>
        <p className="text-white mt-4 max-w-2xl mx-auto">
          Temukan berbagai inspirasi desain arsitektur dan interior yang telah kami buat.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {filterButtons.map((btn) => (
          <Link
            key={btn.type}
            href={btn.href}
            onClick={() => {
              setActiveType(btn.type);
              sessionStorage.setItem("lastType", btn.type);
            }}
            className={`px-4 py-2 rounded-full font-medium transition
    ${activeType === btn.type
                ? "bg-[#BFA98E] text-white"
                : "bg-white text-gray-700 hover:bg-[#D9C8AA]"
              }`}
          >
            {btn.label}
          </Link>

        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat portfolio...</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
          {portfolios.map((item, index) => {
            const coverImage =
              item.image || item.images?.[0] || "/placeholder.png";

            // URL berdasarkan type project
            const linkUrl = typeUrlMap[item.type] || "/";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-md shadow-md cursor-pointer bg-white"
              >
                <Link
                  href={linkUrl}
                  onClick={() =>
                    sessionStorage.setItem("lastType", activeType)
                  }
                >
                  {/* Gambar */}
                  <div className="relative md:h-[550px] h-[350px] w-full overflow-hidden">
                    <Image
                      src={coverImage}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Box teks */}
                  {/* <div className="p-2 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div> */}


                  {/* Badge tipe */}
                  <span className="absolute top-4 left-4 bg-black/50 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {typeLabelMap[item.type] || item.type}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
