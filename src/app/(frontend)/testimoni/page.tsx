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
  const [error, setError] = useState<string | null>(null);

  // FETCH DATA FROM API
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

  return (
    <div className="h-auto bg-gray-50 py-20 px-4 md:px-8 mt-3">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-900">
        Testimoni Klien
      </h1>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500 text-lg">Memuat testimoni...</p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-center text-red-500 text-lg">
          Terjadi kesalahan: {error}
        </p>
      )}

      {/* GRID DATA */}
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
                <div className="relative w-full h-64">
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

                {/* Tombol Video */}
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

      {/* MODAL VIDEO */}
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
    </div>
  );
}
