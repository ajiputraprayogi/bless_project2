"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

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

  // Slider state
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

  // Auto-slide setiap 4 detik
  useEffect(() => {
    if (data.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % data.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [data]);

  return (
    <div className="h-auto bg-gray-50 py-20 px-4 md:px-8 mt-3">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-900">
        Testimoni Klien
      </h1>

      {/* ======================== SLIDER TESTIMONI ======================== */}
      {!loading && !error && data.length > 0 && (
        <div className="max-w-4xl mx-auto mb-16 relative overflow-hidden">

          {/* Wrapper Slide */}
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
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                  {data[current].avatar ? (
                    <Image
                      src={data[current].avatar!}
                      width={70}
                      height={70}
                      alt={data[current].client}
                      className="rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {data[current].client[0]}
                    </div>
                  )}
                </div>

                {/* Nama */}
                <p className="font-semibold text-gray-800 text-xl">
                  {data[current].client}
                </p>

                {/* Pesan */}
                <p className="text-gray-600 text-md max-w-xl mx-auto italic mt-2">
                  “{data[current].message}”
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tombol Prev / Next */}
          <button
            onClick={() =>
              setCurrent((prev) => (prev - 1 + data.length) % data.length)
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % data.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100"
          >
            ›
          </button>

          {/* Indicator dots */}
          <div className="flex justify-center mt-4 gap-2">
            {data.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  current === i ? "bg-blue-600 scale-110" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* ======================== GRID TESTIMONI ======================== */}
      {loading && <p className="text-center text-gray-500 text-lg">Memuat testimoni...</p>}
      {error && <p className="text-center text-red-500 text-lg">Terjadi kesalahan: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {data.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              {/* Gambar desain */}
              {item.src && (
                <div
                  className="relative w-full h-64"
                  onClick={() => setSelectedImage(item.src!)}
                >
                  <Image
                    src={item.src}
                    alt={item.alt || "Testimoni Image"}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
                </div>
              )}

              {/* Nama & Avatar */}
              <div className="flex items-center px-4 py-3 gap-3">
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    alt={item.client}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {item.client[0]}
                  </div>
                )}
                <span className="font-semibold text-gray-800">{item.client}</span>
              </div>

              {/* Pesan */}
              <div className="px-4 pb-4 flex flex-col gap-2">
                <div className="bg-gray-100 rounded-xl p-3 text-gray-700 text-sm italic">
                  {item.message}
                </div>

                {item.video && item.video.trim() !== "" && (
                  <button
                    onClick={() => setSelectedVideo(item.video!)}
                    className="flex items-center justify-center gap-2 mt-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <span className="text-lg">▶</span>
                    <span>Video Testimoni</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ======================== MODAL VIDEO ======================== */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            key="video-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full max-w-5xl h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={selectedVideo}
                title="Video Testimoni"
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================== MODAL IMAGE ======================== */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full max-w-5xl h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 text-white text-2xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
