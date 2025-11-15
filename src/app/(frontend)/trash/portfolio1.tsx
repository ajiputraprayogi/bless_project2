"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

interface PortfolioItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");

  const selectedItem =
    selectedIndex !== null ? portfolios[selectedIndex] : null;

  async function fetchData(type: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `/dummyapi/eksteriors${type !== "all" ? "?type=" + type : ""}`
      );
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data: PortfolioItem[] = await res.json();

      // kalau "all", hanya ambil 3
      const limited = type === "all" ? data.slice(0, 3) : data;
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
          Temukan berbagai inspirasi desain arsitektur dan interior yang telah
          kami buat.
        </p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {filterButtons.map((btn) => (
          <button
            key={btn.type}
            onClick={() => setActiveType(btn.type)}
            className={`px-4 py-2 rounded-full font-medium transition ${activeType === btn.type
                ? "bg-[#BFA98E] text-white"
                : "bg-white text-gray-700 hover:bg-[#D9C8AA]"
              }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Grid Card */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat portfolio...</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
          {portfolios.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-md shadow-md cursor-pointer bg-white"
              onClick={() => {
                setSelectedIndex(index);
                setActiveImage(0);
              }}
            >
              <div className="relative h-[500px] w-full overflow-hidden">
                <Image
                  src={item.image}
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
            </motion.div>
          ))}
        </div>
      )}

      {/* ================ SINGLE MODAL SLIDER ================ */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              className="relative w-[95%] sm:w-[90%] md:w-[80%] lg:max-w-5xl h-[75vh] md:h-[80vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gambar aktif */}
              <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-black/30">
                <Image
                  src={
                    selectedItem.images[activeImage] ?? selectedItem.image
                  }
                  alt={selectedItem.title}
                  fill
                  priority
                  className="object-contain md:object-cover rounded-lg transition-all duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
              </div>

              {/* Tombol Prev/Next */}
              {selectedItem.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev === 0
                          ? selectedItem.images.length - 1
                          : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 hover:bg-black/60 px-3 py-1 rounded-full"
                  >
                    ‹
                  </button>

                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev === selectedItem.images.length - 1
                          ? 0
                          : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 hover:bg-black/60 px-3 py-1 rounded-full"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Close */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 text-white text-xl"
              >
                ✕
              </button>

              {/* Caption */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] md:w-[60%] bg-black/40 backdrop-blur-md text-white rounded-lg px-4 py-3 text-center shadow-lg">
                <h3 className="text-lg font-semibold">
                  {selectedItem.title} — Pose {activeImage + 1}
                </h3>
                <p className="text-sm opacity-90">
                  {selectedItem.subtitle ||
                    `Foto tampilan ${activeImage + 1}`}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full px-10 flex justify-end mt-4">
        <Link
          href="/portfolio"
          className="px-4 py-2 rounded-xl bg-yellow-300 text-black hover:bg-yellow-600 transition"
        >
          Selengkapnya →
        </Link>
      </div>
    </main>
  );
}
