"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FaBuilding,
  FaUsersCog,
  FaDraftingCompass,
  FaWhatsapp,
  FaTools,
} from "react-icons/fa";

type ProfilResponse = {
  id: number;
  sejarah: string;
  visi: string;
  misi: string[];
};

const features = [
  {
    title: "Desain & Perencanaan",
    description: "Kami akan membantu Anda mendapatkan hasil yang Anda impikan",
    icon: FaBuilding,
  },
  {
    title: "Tim Profesional",
    description: "Didukung tim berpengalaman & profesional",
    icon: FaUsersCog,
  },
  {
    title: "Request Desain",
    description: "Bebas request desain sesuai keinginan Anda",
    icon: FaDraftingCompass,
  },
  {
    title: "Build",
    description: "Bangun baru atau renovasi dengan kualitas terbaik",
    icon: FaTools,
  },
];

export default function ProfilPerusahaan() {
  const [profil, setProfil] = useState<ProfilResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setProfil(data);
      } catch (error) {
        console.error("Fetch gagal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, []);

  return (
    <div className="relative bg-white min-h-screen flex flex-col">
      {/* Floating WA */}
      <div className="fixed bottom-5 right-5 z-50">
        <a
          href="https://api.whatsapp.com/send?phone=6282224015802"
          target="_blank"
          className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <FaWhatsapp className="text-white text-2xl" />
        </a>
      </div>

      {/* HERO */}
      <section className="relative w-full h-[50vh]">
        <Image
          src="/images/design/1.png"
          alt="Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white text-center">
            Profil Perusahaan Bless Kontraktor
          </h1>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ y: -6 }}
                className="bg-gray-50 rounded-xl p-6 text-center shadow"
              >
                <Icon className="text-orange-500 text-4xl mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* PROFIL PERUSAHAAN */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <p className="text-center text-gray-500">Loading data...</p>
        ) : (
          profil && (
            <div className="flex flex-col md:flex-row gap-8">
              {/* LEFT */}
              <div className="md:w-1/3">
                <div className="bg-black p-4">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={350}
                    height={120}
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className="md:w-2/3 space-y-3 text-gray-700">
                <div>
                  <h2 className="text-xl font-semibold mb-1 text-orange-500">Sejarah</h2>
                  <p className="text-justify">{profil.sejarah}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-1 text-orange-500">Visi</h2>
                  <p>{profil.visi}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-1 text-orange-500">Misi</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {profil.misi.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        )}
      </section>
    </div>
  );
}
