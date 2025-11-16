"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  images: string[];
  type: string;
}

export default function ComercialPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const router = useRouter();

  // Fetch portfolio data dari API tipe komersial
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/dummyapi/eksteriors?type=arsitek");
        if (!res.ok) throw new Error("Failed to fetch portfolio data");
        const data: Project[] = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Reset animasi pas scroll ke top
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
      {/* Hero Section */}
      <section className="relative w-full h-[50vh]">
        <Image
          src="/images/design/2.png"
          alt="Background Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white text-center px-4 font-semibold">
            Desain Arsitek
          </h1>
        </div>
      </section>

      {/* Portfolio Section */}
      <section key={resetKey} className="py-20 max-w-6xl mx-auto px-6 mt-3">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[3px] text-[#A4B0BE] uppercase">
            Portfolio
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#2F3542]">
            Portofolio Arsitek
          </h2>
        </div>

        {/* Grid of Projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => router.push(`/portfolio/${item.slug}`)}
            >
              <div className="relative h-[280px] w-full overflow-hidden shadow-md bg-[#DFE4EA]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500">
                  <div className="absolute bottom-5 left-5 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <h3 className="text-lg md:text-xl font-semibold text-white drop-shadow-md">
                      {item.title}
                    </h3>
                    {item.type && (
                      <p className="text-sm text-gray-300">{item.type}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
