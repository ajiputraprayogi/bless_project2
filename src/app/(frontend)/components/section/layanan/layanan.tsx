"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export default function LayananBlessLuxury() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const [activeIndex, setActiveIndex] = useState(0);

  const layanan = [
    {
      title: "Layanan Arsitek",
      description: (
        <>
          <strong>Bless Luxury Kontraktor</strong> menghadirkan layanan arsitektur profesional untuk mewujudkan bangunan impian Anda—elegan, fungsional, dan bernilai tinggi.
          Didukung arsitek berpengalaman, kami melayani desain rumah, villa, apartemen, kost, kantor, hingga bangunan komersial.
          Setiap proyek disesuaikan dengan karakter dan kebutuhan klien, memastikan hasil yang mewah, aman, dan nyaman.
        </>
      ),
      subtitle: "✨ Mewujudkan Desain dengan Sentuhan Elegan",
    },
    {
      title: "Layanan Kontraktor & Renovasi",
      description: (
        <>
          Kami menyediakan layanan pembangunan dan renovasi untuk rumah, villa, kantor, hingga bangunan komersial.
          Fokus kami adalah keindahan, kenyamanan, dan ketahanan bangunan.
          Tim profesional kami memastikan proyek selesai tepat waktu, rapi, dan sesuai standar mutu tinggi dengan fleksibilitas anggaran.
        </>
      ),
      subtitle: "✨ Kualitas, Kenyamanan, dan Keindahan dalam Setiap Pembangunan",
    },
    {
      title: "Desain Interior & Pengerjaan",
      description: (
        <>
          Kami membantu Anda merancang interior yang indah dan fungsional—serta menangani langsung pengerjaannya agar hasil sesuai konsep.
          Baik Anda sudah punya ide atau masih mencari arah, tim kami siap menghadirkan ruang yang mencerminkan karakter dan kenyamanan Anda.
        </>
      ),
      subtitle: "✨ Setiap Detail Ruang Layak Mendapat Sentuhan Kemewahan",
    },
  ];

  const nextCard = () => {
    setActiveIndex((prev) => (prev + 1) % layanan.length);
  };

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y, backgroundImage: "url('/images/design/villa1.jpg')" }}
        className="absolute inset-0 bg-cover bg-center bg-fixed"
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </motion.div>

      {/* Konten Utama */}
      <div className="relative z-10 py-32 px-6 text-center text-[#DFE4EA] w-[100vw] h-screen">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold text-[#DFE4EA] mb-6"
        >
          Layanan Kami
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-[#DFE4EA]/70 leading-relaxed mb-16"
        >
          Kami menghadirkan layanan menyeluruh dari desain hingga pembangunan, dengan pendekatan modern dan berkelas.
        </motion.p>

        {/* Grid Desktop */}
        <div className="hidden md:grid grid-cols-3 gap-10 text-left">
          {layanan.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#2F3542]/70 backdrop-blur-sm p-8 hover:bg-[#2F3542]/90 transition-all"
            >
              <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-[#A4B0BE] mb-6 leading-relaxed">{item.description}</p>
              <p className="italic text-[#DFE4EA]/80">{item.subtitle}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Card dengan Animasi */}
        <div className="md:hidden relative h-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-[#2F3542]/70 backdrop-blur-sm p-8 transition-all cursor-pointer"
              onClick={nextCard}
            >
              <h3 className="text-2xl font-semibold text-white mb-3">{layanan[activeIndex].title}</h3>
              <p className="text-sm text-[#A4B0BE] mb-6 leading-relaxed">{layanan[activeIndex].description}</p>
              <p className="italic text-[#DFE4EA]/80">{layanan[activeIndex].subtitle}</p>
              <p className="text-xs text-[#A4B0BE]/60 mt-2">Ketuk untuk melihat layanan berikutnya</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
