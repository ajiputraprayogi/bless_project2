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
  const params = useParams();
  const { slug } = params;

  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchItem() {
      setLoading(true);
      try {
        const res = await fetch(`/api/portofolio/eksteriors?slug=${slug}`);
        const data: PortfolioItem[] = await res.json();
        setItem(data[0] ?? null);
        setActiveIndex(0); // reset slider
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [slug]);

  if (loading) return <p className="text-center mt-20">Memuat...</p>;
  if (!item) return <p className="text-center mt-20">Portfolio tidak ditemukan</p>;

  const totalImages = item.images.length;

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % totalImages);
  const prevImage = () =>
    setActiveIndex((prev) => (prev - 1 + totalImages) % totalImages);

  return (
    <main className="min-h-screen bg-[#F7F4EF] py-10 px-6 flex flex-col items-center gap-5 pt-[5rem]">
      {/* Slider */}
<div className="relative w-full max-w-5xl mx-auto">
  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-black/5">
    <AnimatePresence mode="wait">
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0"
      >
        <Image
          src={item.images[activeIndex]}
          alt={`${item.title} - ${activeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 1024px"
          className="object-contain"
          priority
        />
      </motion.div>
    </AnimatePresence>

    {/* Navigasi */}
    {totalImages > 1 && (
      <>
        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/40 hover:bg-black/60 px-3 py-1 rounded-lg"
        >
          ‹
        </button>
        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/40 hover:bg-black/60 px-3 py-1 rounded-lg"
        >
          ›
        </button>
      </>
    )}

    {/* Index */}
    {totalImages > 1 && (
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white bg-black/40 px-4 py-1 rounded-full text-sm">
        {activeIndex + 1} / {totalImages}
      </div>
    )}
  </div>
</div>


      {/* Deskripsi */}
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-semibold text-[#2E2B25]">{item.title}</h1>
        <p className="text-gray-600 mt-4">{item.subtitle}</p>
      </div>

            {/* Button Selengkapnya */}
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
