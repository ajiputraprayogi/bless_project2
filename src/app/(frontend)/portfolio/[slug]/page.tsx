"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface PortfolioItem {
  id: number;
  slug: string;
  name: string;
  description: string;
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
        const res = await fetch(`/api/portofolio/eksteriors`);
        const data: PortfolioItem[] = await res.json();

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

  // Fixed image dimensions (in CSS pixels)
  const IMAGE_WIDTH = 800; // adjust as needed
  const IMAGE_HEIGHT = 600; // 4:3 ratio

const highlightKeywords = (
  text: string,
  keywords: string[]
) => {
  return text.split(/(\s+)/).map((part, index) => {
    const cleanPart = part.replace(/[.,]/g, "").toLowerCase();

    const isMatch = keywords.some(
      keyword => keyword.toLowerCase() === cleanPart
    );

    return isMatch ? (
      <strong
        key={index}
        className="font-semibold text-gray-900"
      >
        {part}
      </strong>
    ) : (
      part
    );
  });
};



  return (
    <main className="min-h-screen bg-[#F7F4EF] py-20 px-6 flex flex-col items-center gap-10 pt-[5rem]">
      {/* Fixed-width slider container */}
      <div className="relative w-full max-w-[800px] h-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="relative mt-[3rem]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
          >
            <Image
              src={item.images[activeIndex]}
              alt={item.name}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              className="rounded-xl object-contain w-full h-auto"
              priority // optional: if it's the main image
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {totalImages > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 hover:bg-black/60 px-3 py-1 rounded"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 hover:bg-black/60 px-3 py-1 rounded"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* Index indicator */}
        {totalImages > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/30 px-4 py-1 rounded-full text-sm">
            {activeIndex + 1} / {totalImages}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl font-semibold text-[#2E2B25]">{item.name}</h1>
        <p className="text-gray-600 mt-4 text-justify">{highlightKeywords(item.description, ["Bless", "Arsitek", "dan", "Kontraktor"])}</p>
      </div>

      {/* Contact button */}
      <div className="w-full max-w-4xl flex justify-end">
        <button
          onClick={() => 
  window.open(
    "https://wa.me/6285176965609?text=Halo%20saya%20mau%20tanya%20mengenai%20layanan%20Bless%20Arsitek%20dan%20Kontraktor",
    "_blank"
  )
}
          className="px-6 py-3 bg-yellow-300 text-black rounded-xl hover:bg-yellow-600 transition"
        >
          Hubungi Kami →
        </button>
      </div>
    </main>
  );
}