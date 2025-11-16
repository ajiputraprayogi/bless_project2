"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PortfolioItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  images: string[];
  type: string;
}

export default function JasaKontraktorPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/dummyapi/eksteriors?type=arsitek"); // pakai filter type langsung
        if (!res.ok) throw new Error("Gagal mengambil data dari API");

        const data: PortfolioItem[] = await res.json();
        setPortfolioList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi scroll horizontal
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative w-full h-[50vh]">
        <Image
          src="/images/design/1.png"
          alt="Background Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white text-center px-4 font-semibold">
            Arsitek
          </h1>
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-20 mt-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gray-700 mb-12"
        >
          <p className="mb-4">
            <strong>Bless Kontraktor</strong> menyediakan layanan jasa arsitek
            dengan tim profesional berpengalaman. Kami membantu Anda mendesain rumah, villa, kost, kantor, dan bangunan komersial lainnya.
          </p>
          <p className="mb-4">
            Konsep desain dibuat sesuai keinginan Anda, dikerjakan dengan standar arsitektur tinggi agar indah, aman, dan nyaman.
          </p>
          <p>
            Layanan tersedia untuk seluruh wilayah Indonesia. Konsultasi online mudah dan terpercaya — solusi terbaik mewujudkan rumah impian Anda.
          </p>
          <button
            onClick={() => window.open("https://wa.me/6285176965609", "_blank")}
            className="mt-4 px-5 py-3 bg-orange-600 text-white font-medium rounded-md 
             transition duration-300 ease-in-out transform hover:scale-105 hover:bg-orange-700"
          >
            Hubungi Kami
          </button>
        </motion.div>

        {/* SLIDER PORTFOLIO */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">
              Arsitek
            </h2>
            <button
              onClick={() => router.push(`/desainarsitek`)}
              className="text-orange-600 text-sm hover:underline"
            >
              Lihat Semua →
            </button>
          </div>

          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2"
            >
              {loading ? (
                <div className="flex items-center justify-center w-full text-gray-400 py-12">
                  Loading...
                </div>
              ) : (
                portfolioList.map((item, idx) => (
                  <motion.div
  key={item.id}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: idx * 0.1 }}
  className="w-[220px] h-[180px] flex-shrink-0 overflow-hidden rounded-md 
             cursor-pointer hover:shadow-[8px_8px_0_#2f3542] hover:-translate-y-1 
             transition-all duration-300 relative"
  onClick={() => router.push(`/portofolio/${item.id}`)}
>
  <Image
    src={item.image}
    alt={item.title}
    fill
    className="object-cover"
  />
  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
    {item.type}
  </div>
</motion.div>

                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
