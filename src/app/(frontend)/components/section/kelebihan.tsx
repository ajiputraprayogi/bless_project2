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
            Kelebihan Memakai jasa Bless Kontraktor
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
            Kerugian Tidak Memakai Jasa Bless Kontraktor
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
      </div>
    </main>
  );
}
