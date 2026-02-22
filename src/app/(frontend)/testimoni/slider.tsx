"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Testimonial = {
  id: number;
  client: string;
  message: string;
};

export default function MediaSlider() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dummytesti", { cache: "no-store" });
        if (!res.ok) throw new Error("Fetch failed");
        const json: Testimonial[] = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= AUTOPLAY ================= */
  useEffect(() => {
    if (data.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [data.length]);

  if (loading || data.length === 0) return null;

  return (
    <section className="relative max-w-5xl mx-auto mb-28 px-4">
      {/* ====== GOLD GLOW ====== */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-2/3 h-40 bg-gradient-to-r from-yellow-400/20 via-amber-400/20 to-yellow-300/20 blur-3xl rounded-full" />
      </div>

      {/* ====== SLIDER CARD ====== */}
      <div className="relative rounded-3xl border border-yellow-400/20 bg-zinc-900/70 backdrop-blur-xl shadow-2xl shadow-black/60 px-6 md:px-12 py-16 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -28, scale: 0.97 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-center"
          >
            {/* Message */}
            <p className="text-lg md:text-xl text-gray-200 italic leading-relaxed max-w-3xl mx-auto">
              “{data[current].message}”
            </p>

            {/* Client */}
            <p className="mt-8 font-semibold tracking-wide text-yellow-400">
              {data[current].client}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* ====== CONTROLS ====== */}
        <button
          onClick={() =>
            setCurrent((prev) => (prev - 1 + data.length) % data.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full
            bg-zinc-900/80 border border-yellow-400/30 backdrop-blur
            text-yellow-400 text-xl shadow-lg shadow-black/50
            hover:scale-110 transition"
        >
          ‹
        </button>

        <button
          onClick={() => setCurrent((prev) => (prev + 1) % data.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full
            bg-zinc-900/80 border border-yellow-400/30 backdrop-blur
            text-yellow-400 text-xl shadow-lg shadow-black/50
            hover:scale-110 transition"
        >
          ›
        </button>
      </div>

      {/* ====== INDICATORS ====== */}
      <div className="flex justify-center gap-3 mt-8">
        {data.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300
              ${
                idx === current
                  ? "w-10 bg-yellow-400 shadow-md shadow-yellow-400/40"
                  : "w-2 bg-gray-500/40"
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}