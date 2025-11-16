"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface PortfolioItem {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  images: string[];
  type: string;
}

export default function PortfolioDetailPage() {
  const { slug } = useParams();

  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);

      try {
        const res = await fetch(`/dummyapi/eksteriors`);
        const data: PortfolioItem[] = await res.json();

        // Cari berdasarkan slug
        const project = data.find((p) => p.slug === slug);
        setItem(project ?? null);
        setActiveIndex(0);
      } catch (error) {
        console.log("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchItem();
  }, [slug]);

  if (loading) return <p className="text-center mt-20">Memuat...</p>;
  if (!item) return <p className="text-center mt-20">Data tidak ditemukan</p>;

  const totalImages = item.images.length;

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % totalImages);
  const prevImage = () =>
    setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);

  return (
    <main className="min-h-screen bg-[#F7F4EF] py-20 px-6 flex flex-col items-center gap-10 pt-[5rem]">
      {/* Slider */}
      <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full"
          >
            <Image
              src={item.images[activeIndex]}
              alt={item.title}
              fill
              className="object-contain rounded-lg"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigasi */}
        {totalImages > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 hover:bg-black/60 px-3 py-1"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 hover:bg-black/60 px-3 py-1"
            >
              ›
            </button>
          </>
        )}

        {/* Index */}
        {totalImages > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/30 px-4 py-1 rounded-full text-sm">
            {activeIndex + 1} / {totalImages}
          </div>
        )}
      </div>

      {/* Deskripsi */}
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-semibold text-[#2E2B25]">{item.title}</h1>
        <p className="text-gray-600 mt-4">{item.subtitle}</p>
      </div>

      {/* Button Hubungi Kami */}
      <div className="w-full max-w-4xl flex justify-end">
        <Link
          href="/portfolio"
          className="px-6 py-3 bg-yellow-300 text-black rounded-xl hover:bg-yellow-600 transition"
        >
          Hubungi Kami →
        </Link>
      </div>
    </main>
  );
}
