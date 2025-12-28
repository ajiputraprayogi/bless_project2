"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import MediaSlider from "./slider";

interface Testimoni {
  id: number;
  client: string;
  avatar: string | null;
  src: string | null;
  alt: string | null;
  message: string;
  video: string | null;
}

export default function TestimoniChatPage() {
  const [data, setData] = useState<Testimoni[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    async function fetchTestimoni() {
      try {
        const res = await fetch("/api/testimoni");
        if (!res.ok) throw new Error("Gagal mengambil testimoni");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimoni();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [data]);

  return (
    <div className="bg-gray-50 py-20 px-4 md:px-8 mt-3">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-900">
        Testimoni Klien
      </h1>

       <MediaSlider/>

      {/* ================= GRID ================= */}
      {loading && <p className="text-center text-gray-500">Memuat...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.map((item) => {
            const hasMedia = Boolean(item.src || item.video);

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className={`bg-white rounded-2xl shadow-md overflow-hidden flex flex-col
                  ${!hasMedia ? "bg-gradient-to-br from-gray-50 to-white" : ""}
                `}
              >
                {/* IMAGE */}
                {item.src && (
                  <div
                    className="relative w-full h-64"
                    onClick={() => setSelectedImage(item.src!)}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt || "Testimoni Image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* HEADER */}
                <div
                  className={`flex items-center px-4 py-3 gap-3
                    ${!hasMedia ? "border-b border-gray-100" : ""}
                  `}
                >
                  {item.avatar ? (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={item.avatar}
                        alt={item.client}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      {item.client[0]}
                    </div>
                  )}

                  <span className="font-semibold text-gray-800">
                    {item.client}
                  </span>
                </div>

                {/* MESSAGE + VIDEO */}
                <div
                  className={`px-4 pb-4 flex flex-col gap-3
                    ${!hasMedia ? "pt-4" : ""}
                  `}
                >
                  <div className="bg-gray-100 rounded-xl p-3 text-gray-700 text-sm italic">
                    {item.message}
                  </div>

                  {item.video && item.video.trim() !== "" && (
                    <Link
                      href={`${item.video}`}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      <span>▶</span>
                      <span>Video Testimoni</span>
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ================= MODAL IMAGE ================= */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              className="relative w-full max-w-5xl h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Preview"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
