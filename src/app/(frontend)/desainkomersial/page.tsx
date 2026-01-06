"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  slug: string;
  name: string;
  description: string;
  images: string[];
  type: string;
}

export default function ComercialPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const router = useRouter();

useEffect(() => {
  async function fetchProjects() {
    try {
      const res = await fetch("/api/portofolio/eksteriors");
      if (!res.ok) throw new Error("Failed to fetch portfolio data");
      const data: Project[] = await res.json();

      // Filter hanya tipe arsitek
      const filtered = data.filter((item) => item.type === "komersial");

      setProjects(filtered);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchProjects();
}, []);


  // Reset animasi pas scroll ke atas
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) setResetKey((prev) => prev + 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <section className="py-20 text-center text-[#2F3542]">
        <div className="min-h-[60vh] flex items-center justify-center text-[#a4b0be]">
          <div className="loader border-4 border-[#a4b0be] border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="relative w-full h-[50vh]">
        <Image
          src="/images/design/2.png"
          alt="Background Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white text-center px-4 font-semibold">
            Desain Komersial
          </h1>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section
        key={resetKey}
        className="bg-black py-20 max-w-full mx-auto px-6"
      >
        <div className="text-center mb-12">
          <p className="text-sm tracking-[3px] text-gray-200 uppercase">
            Portfolio
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white">
            Portofolio Bless
          </h2>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
                  {projects.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`
                        group cursor-pointer bg-[#dfe4ea] rounded-xl shadow-md overflow-hidden
                        ${index % 2 === 1 ? "translate-y-4 sm:translate-y-0" : ""}
                      `}
                      onClick={() => router.push(`/portfolio/${item.slug}`)}
                    >
                      {/* IMAGE */}
                      <div className="relative w-full aspect-[16/9] overflow-hidden">
                        <Image
                          src={item.images[0]}       // <= FIX UTAMA
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
                      </div>
        
                      {/* DESCRIPTION */}
                      <div className="px-4 py-2">
                        <h3 className="text-sm md:text-base font-semibold text-gray-800">
                          {item.name}
                        </h3>
        
                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                          {item.type}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
      </section>
    </>
  );
}
