"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PortfolioItem {
  id: number;
  title: string;
  img: string;
  desc: string;
  type: string;
}

export default function JasaKontraktorPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch data dari API dummy
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/dummyapi/portofolio");
        if (!res.ok) throw new Error("Gagal mengambil data dari API");

        const data = await res.json();
        const mapped: PortfolioItem[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          img: item.img,
          desc: item.desc,
          type: item.type,
        }));

        setPortfolioList(mapped);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🎯 Tipe utama
  const mainTypes = ["rumah"];

  // 🧩 Ambil 5 gambar per type
  const filteredByType = mainTypes.map((type) => ({
    type,
    items: portfolioList.filter((p) => p.type === type).slice(0, 5),
  }));

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

        {/* LOOP KATEGORI */}
        {filteredByType.map((group) =>
          group.items.length > 0 ? (
            <div key={group.type} className="mb-16">
              {/* Judul Kategori */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 capitalize">
                  Arsitek
                </h2>
                <button
                  onClick={() => router.push(`/portofolio`)}
                  className="text-orange-600 text-sm hover:underline"
                >
                  Lihat Semua →
                </button>
              </div>

              {/* SLIDER */}
              <div className="relative">
                {/* Tombol geser kiri */}
                {/* <button
                  onClick={scrollLeft}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 z-10 hover:bg-gray-100 transition backdrop-blur-lg rounded-full"
                >
                  ◀
                </button> */}

                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center w-full text-gray-400 py-12">
                      Loading...
                    </div>
                  ) : (
                    group.items.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="max-w-[220px] bg-white overflow-hidden flex-shrink-0 
                                   hover:shadow-[8px_8px_0_#2f3542] hover:-translate-y-1 
                                   transition-all duration-300 cursor-pointer rounded-md"
                        onClick={() => router.push(`/portofolio/${group.type}`)}
                      >
                        <div className="relative h-36 w-full">
                          <Image
                            src={item.img}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                            {group.type}
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-800 capitalize truncate">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {item.desc || "Tidak ada deskripsi."}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Tombol geser kanan */}
                {/* <button
                  onClick={scrollRight}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 z-10 hover:bg-gray-100 transition rounded-full"
                >
                  ▶
                </button> */}
              </div>
            </div>
          ) : null
        )}
      </section>
    </>
  );
}
