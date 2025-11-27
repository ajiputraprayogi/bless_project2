"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Import ikon untuk tombol scroll
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface PortfolioItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  images: string[];
  type: string;
}

// Data Manfaat/Poin Unggulan Arsitek
const benefits = [
    {
        icon: <CheckCircle className="w-6 h-6 text-orange-600" />,
        title: "Desain Kustom Unik",
        description: "Setiap desain dibuat khusus sesuai preferensi, gaya hidup, dan anggaran Anda."
    },
    {
        icon: <CheckCircle className="w-6 h-6 text-orange-600" />,
        title: "Tim Profesional",
        description: "Didukung oleh tim arsitek dan desainer interior berpengalaman dan tersertifikasi."
    },
    {
        icon: <CheckCircle className="w-6 h-6 text-orange-600" />,
        title: "Revisi Tanpa Batas*",
        description: "Kami berkomitmen memastikan Anda puas. Revisi desain tanpa batas (sesuai ketentuan)."
    },
    {
        icon: <CheckCircle className="w-6 h-6 text-orange-600" />,
        title: "Konsultasi Mudah",
        description: "Layanan konsultasi online yang mudah diakses di seluruh wilayah Indonesia."
    }
];


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
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" }); // Diubah menjadi 320 untuk mengakomodasi lebar item + gap
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" }); // Diubah menjadi 320

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Jeda antar item
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


  return (
    <>
      {/* HERO SECTION */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden"> {/* Tinggi hero ditingkatkan */}
        <Image
          src="/images/design/1.png"
          alt="Background Hero Arsitek"
          fill
          className="object-cover transition-transform duration-1000 ease-in-out hover:scale-105" // Efek hover pada gambar hero
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4"> {/* Overlay lebih gelap */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl text-white font-extrabold tracking-tight text-center mb-4 drop-shadow-xl" // Font lebih besar dan tebal
          >
            Jasa Arsitek
          </motion.h1>
          <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.3 }}
             className="text-lg md:text-xl text-white/90 text-center max-w-2xl"
          >
            Wujudkan hunian impian Anda dengan desain yang inovatif, fungsional, dan sesuai anggaran.
          </motion.p>
        </div>
      </section>

      {/* --- */}

      {/* INTRO & CALL TO ACTION SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-gray-700 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
             Konsultasikan Desain Impian Anda
          </h2>
          <p className="mb-4 text-lg max-w-3xl mx-auto">
            <strong>Bless Kontraktor</strong> menyediakan layanan **jasa arsitek profesional** yang berfokus pada estetika, kenyamanan, dan keamanan. Kami siap mendesain rumah, villa, kost, kantor, dan bangunan komersial lainnya.
          </p>
          <p className="mb-6 text-lg max-w-3xl mx-auto">
            Konsep desain dibuat 100% sesuai keinginan dan kebutuhan Anda, dikerjakan dengan standar arsitektur tertinggi. Layanan tersedia untuk seluruh wilayah Indonesia.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(249, 115, 22, 0.5), 0 4px 6px -2px rgba(249, 115, 22, 0.05)" }} // Bayangan saat hover
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open("https://wa.me/6285176965609", "_blank")}
            className="mt-6 px-8 py-4 bg-orange-600 text-white font-semibold text-lg rounded-full 
             shadow-lg shadow-orange-500/50
             transition duration-300 ease-in-out transform" // Tombol bulat dan shadow
          >
            <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.0007 2C6.48627 2 2.00073 6.48554 2.00073 11.9997C2.00073 14.8821 3.14923 17.5147 5.01358 19.336L4.08643 22.2599L7.10659 21.3197C8.59992 22.3168 10.288 22.8227 12.0007 22.8227C17.5152 22.8227 22.0007 18.3371 22.0007 12.8227C22.0007 7.30819 17.5152 2.8227 12.0007 2Z" />
                </svg>
                Hubungi Kami via WhatsApp
            </span>
          </motion.button>
        </motion.div>
      </section>

      {/* --- */}
      
      {/* BENEFIT/MANFAAT SECTION (New Addition) */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
                Mengapa Memilih Jasa Arsitek Kami?
            </h2>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-orange-600"
                        variants={itemVariants}
                    >
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                            {benefit.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* --- */}

      {/* SLIDER PORTFOLIO SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-orange-600 pl-3">
              Karya Arsitek Kami
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={scrollLeft}
                className="p-3 bg-gray-200 text-gray-800 rounded-full hover:bg-orange-600 hover:text-white 
                           transition duration-300 shadow-md disabled:opacity-50"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="p-3 bg-gray-200 text-gray-800 rounded-full hover:bg-orange-600 hover:text-white 
                           transition duration-300 shadow-md disabled:opacity-50"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-2" // Gap ditingkatkan
            >
              {loading ? (
                <div className="flex items-center justify-center w-full min-h-[300px] text-gray-500 text-lg py-12 bg-gray-100 rounded-lg">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memuat Portofolio...
                </div>
              ) : (
                portfolioList.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="w-[300px] md:w-[350px] h-[350px] flex-shrink-0 overflow-hidden rounded-xl 
                        cursor-pointer shadow-xl border border-gray-100
                        hover:shadow-2xl hover:border-orange-600 hover:scale-[1.02]
                        transition-all duration-300 relative group" // Efek group untuk hover
                    onClick={() => router.push(`/portofolio/${item.id}`)}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110" // Efek zoom pada gambar
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
                        <h3 className="text-white text-xl font-semibold truncate group-hover:text-orange-300 transition-colors">
                            {item.title}
                        </h3>
                    </div>
                  </motion.div>
                ))
              )}
               {/* Tambahkan tombol 'Lihat Semua' di akhir slider */}
               {!loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: portfolioList.length * 0.1 }}
                        className="w-[300px] md:w-[350px] h-[350px] flex-shrink-0 flex items-center justify-center 
                                   rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 
                                   cursor-pointer hover:bg-gray-100 transition duration-300"
                        onClick={() => router.push(`/desainarsitek`)} // Arahkan ke halaman semua portofolio (jika ada)
                    >
                        <span className="text-lg font-semibold text-orange-600 flex items-center">
                            Lihat Semua Proyek →
                        </span>
                    </motion.div>
                )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}