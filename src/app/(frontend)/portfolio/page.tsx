"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null); // ⬅️ untuk gambar full page

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/dummyapi/portofolio");
        if (!res.ok) throw new Error("Gagal mengambil data portofolio");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-20 text-center text-[#2F3542]">
        <p>Memuat data portofolio...</p>
      </section>
    );
  }

  return (
    <section className="py-20 max-w-6xl mx-auto px-6 mt-3">
      {/* Header Section */}
      <div className="text-center mb-12">
        <p className="text-sm tracking-[3px] text-[#A4B0BE] uppercase">
          Karya Kami
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-[#2F3542]">
          Proyek Desain Terbaru
        </h2>
      </div>

      {/* Grid Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {projects.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div
              className="relative h-[280px] w-full overflow-hidden shadow-md bg-[#DFE4EA]"
              onClick={() => setSelected(item)}
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500">
                <div className="absolute bottom-5 left-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-md">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Fullscreen Image */}
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
              className="relative w-[90%] max-w-5xl h-[80vh]"
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
                className="object-contain rounded-lg"
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
              >
                ✕
              </button>
              <div className="absolute bottom-6 left-0 right-0 text-center text-white">
                <h3 className="text-xl font-semibold">{selected.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
