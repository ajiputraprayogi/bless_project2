"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import MediaSlider from "./slider";

/* ================= TYPES ================= */
interface Testimoni {
  id: number;
  client: string;
  avatar: string | null;
  src: string | null;
  alt: string | null;
  message: string;
  video: string | null;
}

/* ================= HELPERS ================= */
function getYoutubeEmbed(url: string) {
  try {
    const u = new URL(url);

    // ✅ youtube.com/watch?v=ID
    if (u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }

    // ✅ youtu.be/ID
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }

    // ✅ youtube.com/shorts/ID
    if (u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/shorts/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }

    return null;
  } catch {
    return null;
  }
}

/* ================= CARD IMAGE ================= */
function ImageCard({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string | null;
  onClick: (src: string) => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="border border-yellow-400/20 bg-zinc-900 rounded-2xl shadow-lg shadow-black/40 overflow-hidden cursor-pointer border border-white/5"
      onClick={() => onClick(src)}
    >
      <div className="relative w-full h-64">
        <Image
          src={src}
          alt={alt || "Screenshot Chat"}
          fill
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}

/* ================= CARD VIDEO ================= */
function VideoCard({ video }: { video: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="border border-yellow-400/20 bg-zinc-900 rounded-2xl shadow-lg shadow-black/40 overflow-hidden border border-white/5"
    >
      <div className="relative w-full aspect-video bg-black">
        <iframe
          src={getYoutubeEmbed(video) ?? undefined}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </motion.div>
  );
}

/* ================= PAGE ================= */
export default function TestimoniChatPage() {
  const [dummy, setDummy] = useState<Testimoni[]>([]);
  const [sschat, setSSChat] = useState<Testimoni[]>([]);
  const [videos, setVideos] = useState<Testimoni[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchTestimoni() {
      try {
        const res = await fetch("/api/testimoni");
        if (!res.ok) throw new Error("Gagal mengambil testimoni");

        const json: Testimoni[] = await res.json();

        setDummy(json.filter(item => !item.src && !item.video));
        setSSChat(json.filter(item => item.src && !item.video));
        setVideos(json.filter(item => item.video));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimoni();
  }, []);

  return (
    <div className="bg-black py-10 px-4 md:px-8 mt-3 min-h-screen text-gray-200">
      <section className="relative w-full h-[50vh] md:h-[60vh] mb-20">
  <Image
    src="/images/design/2.png" // ganti sesuai asset lo
    alt="Hero Testimoni"
    fill
    priority
    className="object-cover"
  />

  {/* overlay */}
  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white text-center px-4"
    >
      Testimoni Klien
    </motion.h1>
  </div>
</section>

      <MediaSlider />

      {loading && (
        <p className="text-center text-gray-400 mt-10">Memuat...</p>
      )}
      {error && (
        <p className="text-center text-red-500 mt-10">{error}</p>
      )}

      {!loading && !error && (
        <div className="space-y-24 max-w-7xl mx-auto">

          {/* ================= DUMMY ================= */}
          {dummy.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-8 text-center text-white">
                Chat Klien
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {dummy.map(item => (
                  <motion.div
                    key={item.id}
                    className="bg-zinc-900 rounded-2xl shadow-lg shadow-black/40 p-6 border border-white/5 text-gray-300"
                  >
                    {item.message}
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ================= SS CHAT ================= */}
          {sschat.length > 0 && (
            <section>
              <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-white">
                Screenshot Chat Klien
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sschat.map(item => (
                  <ImageCard
                    key={item.id}
                    src={item.src!}
                    alt={item.alt}
                    onClick={setSelectedImage}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ================= VIDEO ================= */}
          {videos.length > 0 && (
            <section>
              <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-white">
                Video Testimoni
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map(item => (
                  <VideoCard key={item.id} video={item.video!} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ================= MODAL IMAGE ================= */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
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