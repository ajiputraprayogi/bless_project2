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

        // hanya arsitek
        const filtered = data.filter((item) => item.type === "arsitek");
        setProjects(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // reset animasi saat scroll ke atas
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) setResetKey((prev) => prev + 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="relative w-full h-[50vh]">
        <Image
          src="/images/bg1.jpg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white font-semibold">
            Desain Arsitek
          </h1>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section
        key={resetKey}
        className="bg-black py-20 px-6 md:px-10"
      >
        {/* WRAPPER MAX WIDTH */}
        <div className="max-w-screen-2xl mx-auto">
          {/* TITLE */}
          <div className="text-center mb-14">
            <p className="text-xs tracking-[4px] text-gray-400 uppercase">
              Portfolio
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2">
              Portofolio Arsitek
            </h2>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => router.push(`/portfolio/${item.slug}`)}
                className="group cursor-pointer bg-[#f1f2f6] rounded-2xl overflow-hidden shadow-lg"
              >
                {/* IMAGE */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500" />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-1 capitalize">
                    {item.type}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
