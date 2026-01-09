"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Puzzle, UserRound, RefreshCw, MessageCircle } from "lucide-react";


interface Project {
  id: number;
  slug: string;
  name: string;
  description: string;
  images: string[];
  type: string;
}

const benefits = [
  {
    icon: <Puzzle className="w-6 h-6 text-orange-600" />,
    title: "Desain Kustom Unik",
    description: "Setiap desain dibuat khusus sesuai preferensi, gaya hidup, dan anggaran Anda."
  },
  {
    icon: <UserRound className="w-6 h-6 text-orange-600" />,
    title: "Tim Profesional",
    description: "Didukung oleh tim Kontraktor dan desainer interior berpengalaman dan tersertifikasi."
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-orange-600" />,
    title: "Revisi Tanpa Batas*",
    description: "Revisi desain tanpa batas (sesuai ketentuan)."
  },
  {
    icon: <MessageCircle className="w-6 h-6 text-orange-600" />,
    title: "Konsultasi Mudah",
    description: "Layanan konsultasi online yang mudah diakses di seluruh Indonesia."
  }
];


export default function JasaKontraktorPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch dari API sesuai interface + filter `type=Kontraktor`
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/portofolio/eksteriors?type=kontraktor");

        if (!res.ok) throw new Error("Gagal mengambil data dari API");

        const data: Project[] = await res.json();
        setProjectList(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* HERO */}
      <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
        <Image
          src="/images/design/1.png"
          alt="Background Hero Kontraktor"
          fill
          className="object-cover transition-transform duration-1000 ease-in-out hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl text-white font-extrabold tracking-tight text-center mb-4 drop-shadow-xl"
          >
            Jasa Kontraktor
          </motion.h1>
        </div>
      </section>

      {/* INTRO */}
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
            <strong>Bless Kontraktor</strong> menyediakan layanan <b>jasa Kontraktor profesional</b>.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open("https://wa.me/6285176965609", "_blank")}
            className="mt-6 px-8 py-4 bg-orange-600 text-white font-semibold text-lg rounded-full shadow-lg"
          >
            Hubungi Kami via WhatsApp
          </motion.button>
        </motion.div>
      </section>

      {/* BENEFITS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Mengapa Memilih Jasa Kontraktor Kami?
          </h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-orange-600"
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

      {/* PORTFOLIO SLIDER */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 border-l-4 border-orange-600 pl-3">
              Karya Kontraktor Kami
            </h2>

            <div className="flex space-x-3">
              <button
                onClick={scrollLeft}
                className="p-3 bg-gray-200 text-gray-800 rounded-full hover:bg-orange-600 hover:text-white transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="p-3 bg-gray-200 text-gray-800 rounded-full hover:bg-orange-600 hover:text-white transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative">
  <div
    ref={scrollRef}
    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-2"
  >
    {loading ? (
      <div className="flex items-center justify-center w-full min-h-[300px] text-gray-500 text-lg py-12 rounded-lg">
        Memuat Portofolio...
      </div>
    ) : (
      // Loop setiap project
      projectList.map((project, idx) => {
        // Ambil kata Progress ... % dari description
        const progressMatch = project.description.match(/Progress\s*\d+\s*%/i);
        const progressText = progressMatch ? progressMatch[0] : "";

        // Loop tiap image project
        return project.images.map((img, i) => (
          <motion.div
            key={`${project.id}-${i}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 + i * 0.05 }}
            className="w-1/3 aspect-[16/9] flex-shrink-0 rounded-xl cursor-pointer shadow-xl hover:scale-[1.02] transition-all relative group overflow-hidden transform-gpu"
          >
            {/* IMAGE */}
            <Image
              src={img}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay Progress saja */}
            {progressText && (
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-medium">
                {progressText}
              </div>
            )}
          </motion.div>
        ));
      })
    )}
  </div>

  {/* Tombol Hubungi Admin */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => window.open("https://wa.me/6285176965609", "_blank")}
    className="mt-6 px-8 py-4 bg-orange-600 text-white font-semibold text-lg shadow-lg rounded-full"
  >
    Hubungi Admin
  </motion.button>
</div>

        </div>
      </section>
    </>
  );
}
