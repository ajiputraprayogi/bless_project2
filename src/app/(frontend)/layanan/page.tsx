"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import StepSection from "../components/section/layanan/step";
import LayananBlessLuxury from "../components/section/layanan/layanan";

const layananList = [
    // Hunian Rumah
  {
    label: "Desain Rumah",
    images: [
      "/images/design/home1.jpg",
      "/images/design/home2.jpg",
      "/images/design/home3.jpg",
    ],
    desc: "Kami menciptakan desain rumah dengan keseimbangan fungsi dan estetika, menghadirkan ruang yang nyaman dan bernilai tinggi.",
    fitur: [
      "Perencanaan tata ruang efisien",
      "Material berkualitas tinggi",
      "Konsep desain sesuai kebutuhan klien",
    ],
  },
  // Interior
  {
    label: "Desain Interior",
    images: [
      "/images/design/int1.png",
      "/images/design/int2.png",
      "/images/design/int3.png",
    ],
    desc: "Interior kami fokus pada harmoni, pencahayaan alami, dan karakter unik setiap ruangan.",
    fitur: [
      "Pemilihan furnitur dan dekorasi",
      "Optimalisasi pencahayaan alami",
      "Konsultasi tema dan gaya interior",
    ],
  },
  // Eksterior
  {
    label: "Desain Eksterior",
    images: [
      "/images/design/home1.jpg",
      "/images/design/home2.jpg",
      "/images/design/home3.jpg",
    ],
    desc: "Bangunan yang memikat dari luar dan berkarakter kuat, dengan detail material yang elegan.",
    fitur: [
      "Fasad modern dan elegan",
      "Kombinasi warna dan tekstur proporsional",
      "Desain ramah lingkungan",
    ],
  },
//   // Kost
//     {
//     label: "Kost & Perumahan",
//     images: [
//       "/images/design/int1.png",
//       "/images/design/int2.png",
//       "/images/design/int3.png",
//     ],
//     desc: "Memberikan solusi desain modern untuk hunian lama, disesuaikan dengan kebutuhan dan gaya hidup Anda.",
//     fitur: [
//       "Evaluasi struktur bangunan lama",
//       "Desain penyesuaian ruang",
//       "Pendampingan konsultasi desain",
//     ],
//   },
//   // Villa
//     {
//     label: "Villa & Cafe",
//     images: [
//       "/images/design/int1.png",
//       "/images/design/int2.png",
//       "/images/design/int3.png",
//     ],
//     desc: "Memberikan solusi desain modern untuk hunian lama, disesuaikan dengan kebutuhan dan gaya hidup Anda.",
//     fitur: [
//       "Evaluasi struktur bangunan lama",
//       "Desain penyesuaian ruang",
//       "Pendampingan konsultasi desain",
//     ],
//   },
//   // Tempat Ibadah
//     {
//     label: "Tempat Ibadah",
//     images: [
//       "/images/design/int1.png",
//       "/images/design/int2.png",
//       "/images/design/int3.png",
//     ],
//     desc: "Memberikan solusi desain modern untuk hunian lama, disesuaikan dengan kebutuhan dan gaya hidup Anda.",
//     fitur: [
//       "Evaluasi struktur bangunan lama",
//       "Desain penyesuaian ruang",
//       "Pendampingan konsultasi desain",
//     ],
//   },
//     {
//     label: "Tempat Umum",
//     images: [
//       "/images/design/int1.png",
//       "/images/design/int2.png",
//       "/images/design/int3.png",
//     ],
//     desc: "Memberikan solusi desain modern untuk hunian lama, disesuaikan dengan kebutuhan dan gaya hidup Anda.",
//     fitur: [
//       "Evaluasi struktur bangunan lama",
//       "Desain penyesuaian ruang",
//       "Pendampingan konsultasi desain",
//     ],
//   },
];

export default function LayananPage() {
  const [active, setActive] = useState(layananList[0]);
  const [imageIndex, setImageIndex] = useState(0);

  // Auto slide gambar tiap 4 detik
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setImageIndex((prev) => (prev + 1) % active.images.length);
//     }, 4000);
//     return () => clearInterval(interval);
//   }, [active]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: "#F7F4EF", color: "#2E2B25" }}
    >

      {/* Step Section */}
      <section>
        <div className="text-center mb-12 mt-12 md:mt-20">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-3 text-[#2E2B25]">
            Tahapan Order
          </h1>
          <p className="text-sm md:text-base text-[#2E2B25]/70">
            Berikut skema layanan yang tersedia
          </p>
        </div>
        <StepSection />
      </section>

      <LayananBlessLuxury/>
    </main>
  );
}
