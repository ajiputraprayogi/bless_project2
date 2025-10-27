"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  desc: string;
  img: string;
  size?: string;
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [selected, setSelected] = useState<null | PortfolioItem>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch dari dummyapi/data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/dummyapi/data");
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data = await res.json();
        setPortfolios(data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[#DFE4EA] py-20 px-6 mt-4">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm tracking-[3px] text-[#A4B0BE] uppercase">
          Koleksi Desain Arsitektur
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold text-[#2F3542]">
          Portfolio Bless Design
        </h1>
        <p className="text-[#57606f] mt-4 max-w-2xl mx-auto">
          Jelajahi inspirasi desain modern dan minimalis — menciptakan ruang
          yang fungsional, elegan, dan selaras dengan gaya hidup Anda.
        </p>
      </div>

      {/* Loading state */}
      {loading ? (
        <p className="text-center text-[#57606f]">Memuat portfolio...</p>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {portfolios.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden shadow-md cursor-pointer rounded-xl bg-white"
              onClick={() => setSelected(item)}
            >
              <div className="relative h-[280px] w-full overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500"></div>
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 text-white">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative w-[90%] max-w-5xl h-[80vh] bg-[#2F3542]/90 rounded-lg shadow-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selected.img}
                alt={selected.title}
                fill
                className="object-contain"
              />

              {/* Close Button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-white bg-[#A4B0BE]/40 hover:bg-[#A4B0BE]/70 rounded-full p-2 transition"
              >
                ✕
              </button>

              {/* Caption */}
              <div className="absolute bottom-6 left-0 right-0 text-center text-white px-4">
                <h3 className="text-xl font-semibold">{selected.title}</h3>
                <p className="text-sm text-[#DFE4EA] mt-2">{selected.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
