"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import WhyChooseUs from "../../atomic/PilihKami";

interface HeroSectionProps {
  onExploreClick: () => void;
}

interface Banner {
  id: string;
  img: string;
  active: boolean;
}

export default function HeroSection({ onExploreClick }: HeroSectionProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch("/api/banner");
        if (!res.ok) throw new Error("Gagal fetch banner");
        const data: Banner[] = await res.json();
        setBanners(data);
      } catch (err) {
        console.error("Error loading banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Pilih banner aktif pertama, jika tidak ada fallback default
  const activeBanner =
    banners.find((b) => b.active) ?? {
      img: "/images/design/1.png",
      active: true,
      id: "default",
    };

  return (
    <section className="relative h-[100vh] w-full">
      {/* Background image */}
      <Image
        src={activeBanner.img}
        alt="Hero Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-[7rem] font-montserrat tracking-wide text-white/90"
        >
          Bless Arsitek<br /><span className="text-yellow-400">Kontraktor</span>
        </motion.h1>

        <button
          onClick={onExploreClick}
          className="mt-8 cursor-pointer group relative inline-flex items-center justify-center overflow-hidden rounded-3xl bg-[#dfe4ea] font-medium w-auto transition-all duration-500 hover:scale-[1.03]"
        >
          <div className="inline-flex h-12 translate-y-0 items-center justify-center px-8 text-[#2E2B25] transition-all duration-500 group-hover:-translate-y-[150%]">
            Eksplor Sekarang
          </div>

          <div className="absolute inline-flex h-24 w-full translate-y-[100%] items-center justify-center text-[#2E2B25] transition-all duration-500 group-hover:translate-y-0">
            <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-[#ced6e0] transition-all duration-500 group-hover:translate-y-0 group-hover:scale-150"></span>
            <span className="z-10 px-8">Let&apos;s Go</span>
          </div>
        </button>

        {/* Optional loading indicator */}
        {loading && (
          <p className="absolute bottom-8 text-sm text-white/70 animate-pulse">
            Memuat banner...
          </p>
        )}
      </div>
      
    </section>
  );
}
