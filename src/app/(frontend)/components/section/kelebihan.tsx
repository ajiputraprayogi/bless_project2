"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Detail {
  id: number;
  detail: string;
}

interface Item {
  id: number;
  judul: string;
  type: "kelebihan" | "kekurangan";
  kelebihan_kekurangan_detail: Detail[];
}

export default function KelebihanKekuranganPage() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/kelebihan-kekurangan");
        if (!res.ok) throw new Error("Gagal mengambil data");
        const result: Item[] = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 text-center text-[#2F3542]">
        <p>Memuat data kelebihan & kekurangan...</p>
      </section>
    );
  }

  // Pisahkan data
  const kelebihan = data.filter((item) => item.type === "kelebihan");
  const kekurangan = data.filter((item) => item.type === "kekurangan");

  return (
    <main className="min-h-screen bg-transparent w-full py-5 px-3">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-xl tracking-[3px] text-white">
          Pertimbangkan Sebelum Memilih
        </p>
        {/* <h1 className="text-3xl md:text-5xl mt-3 font-semibold text-[#2F3542]">
          Kerugian Tidak Memakai Bless Kontraktor
        </h1> */}
        {/* <p className="text-gray-600 mt-4 max-w-2xl mx-auto hidden md:block">
          Pelajari apa saja keuntungan dan risiko yang perlu Anda pahami sebelum memulai proyek bersama kontraktor profesional.
        </p> */}
      </div>

      {/* Grid 2 Kolom */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-10 max-w-6xl mx-auto">
        {/* Kolom Kelebihan */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-8 bg-[#2F3542]/70 backdrop-blur-sm shadow-sm rounded-2xl border-t-4 border-white"
        >
          <h2 className="text-2xl font-semibold text-green-400 mb-6 border-b border-gray-200 pb-2">
            Mengapa Bless Arsitek dan Kontraktor ?
          </h2>
          {kelebihan.map((item) => (
            <div key={item.id} className="mb-6">
              {/* <h3 className="text-lg font-semibold text-[#2F3542] mb-3">
                {item.judul}
              </h3> */}
              <ul className="space-y-3 text-white text-left">
                {item.kelebihan_kekurangan_detail.map((detail) => (
                  <li
                    key={detail.id}
                    className="flex items-start gap-3 text-[15px] leading-relaxed"
                  >
                    <span className="text-green-400 text-lg mt-[2px]">✓</span>
                    <span>{detail.detail}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  window.open(
                    "https://wa.me/6285176965609?text=Halo%2C%20saya%20mau%20tanya%20mengenai%20layanan...",
                    "_blank"
                  )
                }
                className="mt-3 px-4 py-3 bg-yellow-400 text-black font-medium rounded-md 
             transition duration-300 ease-in-out transform hover:scale-105 hover:bg-yellow-400 hover:text-white"
              >
                Hubungi Kami
              </button>

            </div>
          ))}
        </motion.div>

        {/* Kolom Kekurangan */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-8 bg-[#2F3542]/70 backdrop-blur-sm shadow-sm rounded-2xl border-t-4 border-white"
        >
          <h2 className="text-2xl font-semibold text-red-400 mb-6 border-b border-gray-200 pb-2">
            Bangun Tanpa Arsitek & Kontraktor ? Ini Risikonya.
          </h2>
          {kekurangan.map((item) => (
            <div key={item.id} className="mb-6">
              {/* <h3 className="text-lg font-semibold text-[#2F3542] mb-3">
                {item.judul}
              </h3> */}
              <ul className="space-y-3 text-white text-left">
                {item.kelebihan_kekurangan_detail.map((detail) => (
                  <li
                    key={detail.id}
                    className="flex items-start gap-3 text-[15px] leading-relaxed"
                  >
                    <span className="text-red-500 text-lg mt-[2px]">✕</span>
                    <span>{detail.detail}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() =>
                  window.open(
                    "https://wa.me/6285176965609?text=Halo%2C%20saya%20mau%20tanya%20mengenai%20layanan...",
                    "_blank"
                  )
                }
                className="mt-3 px-4 py-3 bg-yellow-400 text-black font-medium rounded-md 
             transition duration-300 ease-in-out transform hover:scale-105 hover:bg-yellow-400 hover:text-white"
              >
                Hubungi Kami
              </button>

            </div>

          ))}
          
        </motion.div>

<div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-2xl border border-white/20 bg-slate-900 p-8 text-white shadow-2xl">
  
  {/* 1. BACKGROUND IMAGE LAYER */}
  {/* Ganti url di bawah ini dengan path image arsitek Anda, misal: "/images/arsitek-bg.jpg" */}
  <div 
    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
    style={{ 
      backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" 
    }}
  >
    {/* Overlay Gelap & Biru untuk memastikan teks terbaca & menyatu dengan tema */}
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/90 via-yellow-900/80 to-yellow-950/95 backdrop-blur-[2px]" />
  </div>

  {/* 2. GLOW EFFECTS (Diposisikan ulang agar menyatu dengan background) */}
  <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

  {/* 3. CONTENT LAYER */}
  <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
    
    {/* Badge */}
    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-100 shadow-sm backdrop-blur-md">
      Koordinasi Terintegrasi
    </span>

    {/* Heading */}
    <h2 className="text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-md">
      Satu Pintu Koordinasi
    </h2>

    {/* Description */}
    <div className="max-w-2xl">
      <p className="text-lg leading-relaxed text-blue-100/90">
        Dengan arsitek dan kontraktor dalam satu manajemen, komunikasi menjadi
        lebih efektif, mengurangi kesalahpahaman, dan mempercepat pengambilan
        keputusan.
      </p>
    </div>

    {/* Optional: Decorative Line */}
    <div className="h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
  </div>
</div>


      </div>
    </main>
  );
}
