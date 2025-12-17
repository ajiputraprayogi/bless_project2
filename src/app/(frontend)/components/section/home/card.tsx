"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function DesignCategories() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

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
        <div className="min-h-[60vh] flex items-center justify-center text-[#a4b0be]">
          <div className="loader border-4 border-[#a4b0be] border-t-transparent rounded-md w-10 h-10 animate-spin"></div>
        </div>
      </section>
    );
  }

  const mainTypes = ["interior", "rumah", "komersial", "konstruksi"];
  const mainProjects = mainTypes
    .map((type) => projects.find((p) => p.type === type))
    .filter(Boolean);

  const filteredProjects =
    selectedType !== null
      ? projects.filter((p) => p.type === selectedType)
      : [];

  const nextSlide = () =>
    setCurrentIndex((prev) =>
      prev === filteredProjects.length - 1 ? 0 : prev + 1
    );
  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? filteredProjects.length - 1 : prev - 1
    );

  return (
    <section className="py-20 max-w-6xl mx-auto px-6 mt-3">
      <div className="text-center mb-12">
        <p className="text-sm tracking-[3px] text-[#A4B0BE] uppercase">
          Portofolio
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-[#2F3542]">
          Portofolio Bless
        </h2>
      </div>

      {/* GRID KATEGORI */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-8">
        {mainProjects.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
            onClick={() => {
              setSelectedType(item.type);
              setCurrentIndex(0);
            }}
          >
            <div className="relative h-[70vh] w-full overflow-hidden shadow-md rounded-lg">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />

              {/* 🏷️ TITLE JENIS KATEGORI (POJOK KIRI ATAS) */}
              <div className="z-5 absolute top-4 left-4 bg-black/60 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-md shadow-md">
                {item.type.toUpperCase()}
              </div>

              {/* Overlay Judul */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-500 flex items-end p-5">
                <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-md">
                  {item.title}
                </h3>
              </div>

              <div>
                            <button
              onClick={() => router.push(`/portfolio`)}
              className="absolute top-4 right-4 text-white text-md md:text-xl hover:underline"
            >
              Lihat Semua →
            </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL SLIDER */}
      <AnimatePresence>
        {selectedType && filteredProjects.length > 0 && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedType(null)}
          >
            <motion.div
              className="relative w-[90%] max-w-5xl h-[80vh] flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredProjects[currentIndex].img}
                alt={filteredProjects[currentIndex].title}
                fill
                className="object-contain rounded-lg"
              />

              {/* Navigasi */}
              <button
                onClick={prevSlide}
                className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-md hover:bg-black/70 transition"
              >
                ‹
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-md hover:bg-black/70 transition"
              >
                ›
              </button>

              {/* Tombol Tutup */}
              <button
                onClick={() => setSelectedType(null)}
                className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-md p-2 transition"
              >
                ✕
              </button>

              {/* Caption */}
              <div className="absolute bottom-6 left-0 right-0 text-center text-white">
                <h3 className="text-xl font-semibold">
                  {filteredProjects[currentIndex].title}
                </h3>
                <p className="text-sm text-gray-300 mt-1 max-w-2xl mx-auto">
                  {filteredProjects[currentIndex].desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
