"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PortfolioItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  images: string[];
  type: string;
}

// const filterTypes = ["all", "arsitek", "kontraktor", "furnitur"];
const filterButtons = [
  { label: "Semua", type: "all" },
  { label: "Desain Arsitek", type: "arsitek" },
  { label: "Jasa Kontraktor", type: "kontraktor" },
  { label: "Interior & Furniture", type: "furnitur" },
];


export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showSlider, setShowSlider] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all");

  const selected = selectedIndex !== null ? portfolios[selectedIndex] : null;

  async function fetchData(type: string) {
    setLoading(true);
    try {
      const res = await fetch(
        `/dummyapi/eksteriors${type !== "all" ? "?type=" + type : ""}`
      );
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data: PortfolioItem[] = await res.json();
      // kalau "all", cuma ambil 3 pertama aja
      const limitedData = type === "all" ? data.slice(0, 3) : data;

      setPortfolios(limitedData);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
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
          Temukan berbagai inspirasi desain arsitektur dan interior yang telah kami buat —
          setiap proyek membawa karakter unik dengan sentuhan modern minimalis.
        </p>
      </div>

      {/* Filter Buttons */}
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
          {portfolios.map((item, index) => (
            <motion.div
              key={index}
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
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
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

      {/* MODAL #1 (Detail Gambar Utama + Navigasi antar object) */}
      <AnimatePresence>
        {selected && !showSlider && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              className="relative w-[90%] max-w-5xl h-[80vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gambar aktif */}
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                className="object-contain rounded-lg"
              />

              {/* Tombol Next/Prev antar OBJECT */}
              <button
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev !== null
                      ? prev === 0
                        ? portfolios.length - 1
                        : prev - 1
                      : 0
                  )
                }
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-4xl font-bold bg-black/40 hover:bg-black/60 px-3 py-1 transition"
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setSelectedIndex((prev) =>
                    prev !== null
                      ? prev === portfolios.length - 1
                        ? 0
                        : prev + 1
                      : 0
                  )
                }
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-4xl font-bold bg-black/40 hover:bg-black/60 px-3 py-1 transition"
              >
                ›
              </button>

              {/* Tombol Close */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 text-white  p-2 transition"
              >
                ✕
              </button>

              {/* Tombol “Lihat Detail” di pojok kiri atas */}
              {selected.images?.length > 1 && (
                <button
                  onClick={() => setShowSlider(true)}
                  className="z-99 absolute -bottom-8 right-4 bg-white/90 hover:bg-[#A88E72] text-black px-4 py-2 rounded-full text-sm font-medium shadow-md transition"
                >
                  Selengkapnya
                </button>
              )}

              {/* Caption */}
              {/* 🏷️ Caption (seragam di semua layar) */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] md:backdrop-blur-lg bg-black/30 text-white rounded-lg px-4 py-3 text-center shadow-lg">
                <h3 className="text-base sm:text-lg font-semibold">
                  {selected.title} {showSlider && `— Pose ${activeImage + 1}`}
                </h3>
                <p className="text-xs sm:text-sm mt-1 opacity-90">
                  {selected.subtitle || (showSlider && `Foto tampilan ${activeImage + 1}`)}
                </p>
              </div>



            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL #2 (Full Slider) */}
      <AnimatePresence>
        {selected && showSlider && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSlider(false)}
          >
            <motion.div
              className="relative w-[95%] sm:w-[90%] md:w-[80%] lg:max-w-5xl h-[70vh] sm:h-[75vh] md:h-[80vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 🖼️ Gambar utama */}
              <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-black/30">
                <Image
                  src={selected.images[activeImage]}
                  alt={selected.title}
                  fill
                  priority
                  className="object-contain md:object-cover rounded-lg transition-all duration-300"
                  sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 70vw"
                />

                {/* 🌈 Gradient overlay (biar teks kontras tapi halus) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
              </div>

              {/* ⬅️ Tombol Navigasi */}
              {selected.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev === 0 ? selected.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white text-2xl sm:text-3xl font-bold bg-black/40 hover:bg-black/60 px-2 sm:px-3 py-1 transition"
                  >
                    ‹
                  </button>

                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev === selected.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white text-2xl sm:text-3xl font-bold bg-black/40 hover:bg-black/60 px-2 sm:px-3 py-1 transition"
                  >
                    ›
                  </button>
                </>
              )}

              {/* ❌ Tombol Close */}
              <button
                onClick={() => setShowSlider(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white p-1.5 sm:p-2 transition"
              >
                ✕
              </button>

              {/* 🏷️ Caption Responsif */}
              {/* 🏷️ Caption (seragam di semua layar) */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] backdrop-blur-lg text-white rounded-lg px-4 py-3 text-center shadow-lg">
                <h3 className="text-base sm:text-lg font-semibold">
                  {selected.title} {showSlider && `— Pose ${activeImage + 1}`}
                </h3>
                <p className="text-xs sm:text-sm mt-1 opacity-90">
                  {selected.subtitle || (showSlider && `Foto tampilan ${activeImage + 1}`)}
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </main>
  );
}
