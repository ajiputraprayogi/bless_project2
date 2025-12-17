"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ComercialPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [selected, setSelected] = useState<any | null>(null);

  // Fetch portfolio data from API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/dummyapi/portofolio?type=komersial");
        if (!res.ok) throw new Error("Failed to fetch portfolio data");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // Reset animation when scrolled to top
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
            House Design
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
            Portofolio Bless
          </h2>
        </div>

        {/* Grid of Projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {projects.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div
                className="relative h-[280px] w-full overflow-hidden shadow-md bg-[#DFE4EA]"
                onClick={() => setSelected(item)}
              >
                <Image
                  src={item.img}
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

        {/* Fullscreen Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                className="relative w-[90%] max-w-5xl h-[80vh]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selected.img}
                  alt={selected.title}
                  fill
                  className="object-contain rounded-lg"
                />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 transition"
                >
                  ✕
                </button>
                <div className="absolute bottom-6 left-0 right-0 text-center text-white">
                  <h3 className="text-xl font-semibold">{selected.title}</h3>
                  {selected.type && (
                    <p className="text-sm text-gray-300 mt-1">
                      {selected.type}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
