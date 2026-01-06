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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dummytesti", {
          cache: "no-store",
        });

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

  // auto slide (opsional)
  useEffect(() => {
    if (data.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [data.length]);

  if (loading || data.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto mb-20 relative overflow-hidden">
      <div className="relative h-60 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center px-6"
          >
            {/* Avatar Inisial */}
            {/* <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {data[current].client.charAt(0)}
              </div>
            </div> */}

            <p className="font-semibold text-xl w-auto p-4 bg-yellow-200 text-yellow-800 rounded-xl">
              {data[current].client}
            </p>

            <p className="text-gray-600 italic text-xl mt-2 max-w-xl mx-auto">
              “{data[current].message}”
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + data.length) % data.length)
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % data.length)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
      >
        ›
      </button>
    </div>
  );
}
