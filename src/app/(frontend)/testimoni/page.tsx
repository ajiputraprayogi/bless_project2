"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const testimoniChat = [
  {
    id: 1,
    client: "Budi",
    avatar: "/images/user/ferry.jpg",
    src: "/images/design/whatsap.jpg",
    alt: "Desain Rumah 1",
    message: "Desain rumahnya keren dan sesuai harapan! Mungkin kedepan bakal pesan lagi :)",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 2,
    client: "Ferry",
    avatar: "/images/user/ferry.jpg",
    src: "/images/design/2.png",
    alt: "Desain Rumah 2",
    message: "Pelayanan cepat, komunikasi lancar banget. Preview desainnya juga memuaskan!",
    video: "https://www.youtube.com/embed/3JZ_D3ELwOQ"
  },
  {
    id: 3,
    client: "Andi",
    avatar: "/images/user/ferry.jpg",
    src: "/images/design/3.png",
    alt: "Desain Rumah 3",
    message: "Desain rumah minimalis modern sesuai budget.",
    video: "https://www.youtube.com/embed/3JZ_D3ELwOQ"
  },
];

export default function TestimoniChatPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4 md:px-8 mt-3">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-900">
        Testimoni Klien
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {testimoniChat.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            {/* Gambar desain rumah */}
            {item.src && (
              <div className="relative w-full h-64">
                <Image
                  src={item.src}
                  alt={item.alt}
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

            {/* Pesan testimoni */}
            <div className="px-4 pb-4 flex flex-col gap-2">
              <div className="bg-gray-100 rounded-xl p-3 text-gray-700 text-sm italic">
                {item.message}
              </div>

              {/* Tombol video */}
              {/* Tombol video */}
              {item.video && item.video.trim() !== "" && (
                <button
                  onClick={() => setSelectedVideo(item.video)}
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

      {/* Modal video full screen */}
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
