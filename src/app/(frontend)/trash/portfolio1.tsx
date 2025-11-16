"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

interface PortfolioItem {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  image?: string;
  images: string[];
  type: string;
}

const filterButtons = [
  { label: "Semua", type: "all" },
  { label: "Desain Arsitek", type: "arsitek" },
  { label: "Jasa Kontraktor", type: "kontraktor" },
  { label: "Interior & Furniture", type: "furnitur" },
];

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");

  // ⬇️ Ambil filter sebelumnya
  useEffect(() => {
    const saved = sessionStorage.getItem("lastType");
    if (saved) {
      setActiveType(saved);
    }
  }, []);

  async function fetchData(type: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `dummyapi/eksteriors${type !== "all" ? "?type=" + type : ""}`
      );

      if (!res.ok) throw new Error("Gagal mengambil data");

      const data: PortfolioItem[] = await res.json();

      const limited = data.slice(0, 5); // limit 5

      setPortfolios(limited);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(activeType);
  }, [activeType]);

  return (
    <main className="min-h-screen bg-[#F7F4EF] py-20 px-6 mt-4">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm tracking-[3px] text-[#BFA98E] uppercase">
          Koleksi Desain
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-[#2E2B25]">
          Portfolio Bless Design
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Temukan berbagai inspirasi desain arsitektur dan interior yang telah kami buat.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {filterButtons.map((btn) => (
          <button
            key={btn.type}
            onClick={() => {
              setActiveType(btn.type);
              sessionStorage.setItem("lastType", btn.type); // simpan
            }}
            className={`px-4 py-2 rounded-full font-medium transition ${
              activeType === btn.type
                ? "bg-[#BFA98E] text-white"
                : "bg-white text-gray-700 hover:bg-[#D9C8AA]"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat portfolio...</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
          {portfolios.map((item, index) => {
            const coverImage = item.image || item.images?.[0] || "/placeholder.png";

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
                  href={`/portfolio/${item.slug}`}
                  onClick={() => sessionStorage.setItem("lastType", activeType)}
                >
                  <div className="relative h-[500px] w-full overflow-hidden">
                    <Image
                      src={coverImage}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500"></div>

                    <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 text-white">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-200">{item.subtitle}</p>
                    </div>
                  </div>

                  <span className="absolute top-4 left-4 bg-black/50 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {item.type}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Button kanan */}
      <div className="w-full mt-[3rem] px-10 flex justify-end">
        <Link
          href="/desainarsitek"
          className="px-4 py-2 bg-yellow-300 text-black text-sm rounded-lg hover:bg-yellow-400 transition"
        >
          Lihat Semua →
        </Link>
      </div>
    </main>
  );
}
