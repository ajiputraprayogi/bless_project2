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
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const kelebihan = data.filter((item) => item.type === "kelebihan");
  const kekurangan = data.filter((item) => item.type === "kekurangan");

  if (loading) {
    return (
      <section className="py-20 text-center text-[#2F3542]">
        <p>Memuat data kelebihan & kekurangan...</p>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F4EF] py-20 px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm tracking-[3px] text-[#A4B0BE] uppercase">
          Pertimbangkan Sebelum Memilih
        </p>
        <h1 className="text-3xl md:text-5xl mt-3 font-semibold text-[#2F3542]">
          Kelebihan & Kekurangan
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto hidden md:block">
          Pahami keuntungan dan potensi tantangan dalam menggunakan jasa
          kontraktor untuk proyek desain atau pembangunan Anda.
        </p>
      </div>

      {/* Grid dua kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* KELEBIHAN */}
        {kelebihan.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-[#DFE4EA] p-8 rounded-2xl shadow-sm"
          >
            <h2 className="text-2xl font-semibold text-[#2F3542] mb-6 border-b border-[#A4B0BE] pb-2">
              {item.judul}
            </h2>
            <ul className="space-y-4 text-[#2F3542]">
              {item.kelebihan_kekurangan_detail.map((detail) => (
                <li
                  key={detail.id}
                  className="flex items-start gap-3 text-[15px] leading-relaxed"
                >
                  <span className="text-green-600 text-lg mt-1">✓</span>
                  <span>{detail.detail}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* KEKURANGAN */}
        {kekurangan.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="bg-[#DFE4EA] p-8 rounded-2xl shadow-md"
          >
            <h2 className="text-2xl font-semibold text-[#2F3542] mb-6 border-b border-[#A4B0BE]/40 pb-2">
              {item.judul}
            </h2>
            <ul className="space-y-4 text-[#2F3542]">
              {item.kelebihan_kekurangan_detail.map((detail) => (
                <li
                  key={detail.id}
                  className="flex items-start gap-3 text-[15px] leading-relaxed"
                >
                  <span className="text-red-400 text-lg mt-1">✕</span>
                  <span>{detail.detail}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
