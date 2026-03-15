"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
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
    if (u.searchParams.get("v")) return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/shorts/")[1];
      return `https://www.youtube.com/embed/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

/* ================= SCREENSHOT CAROUSEL (3-per-row) ================= */
function useColumnsPerView() {
  const [cols, setCols] = useState(1);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setCols(3);
      else if (window.innerWidth >= 640) setCols(2);
      else setCols(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

function ScreenshotCarousel({
  items,
  onOpenFullscreen,
}: {
  items: Testimoni[];
  onOpenFullscreen: (index: number) => void;
}) {
  const cols = useColumnsPerView();
  const [page, setPage] = useState(0);
  const dragStartX = useRef(0);
  const isDragging = useRef(false);

  const totalPages = Math.ceil(items.length / cols);

  const goTo = useCallback(
    (p: number) => setPage(Math.max(0, Math.min(p, totalPages - 1))),
    [totalPages]
  );

  /* reset page when cols change so we don't land on empty page */
  useEffect(() => { setPage(0); }, [cols]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(page - 1);
      if (e.key === "ArrowRight") goTo(page + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [page, goTo]);

  const onDragStart = (clientX: number) => {
    dragStartX.current = clientX;
    isDragging.current = true;
  };
  const onDragEnd = (clientX: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = clientX - dragStartX.current;
    if (delta < -50) goTo(page + 1);
    else if (delta > 50) goTo(page - 1);
  };

  if (items.length === 0) return null;

  const visibleItems = items.slice(page * cols, page * cols + cols);

  return (
    <div className="relative select-none">
      {/* ---- Row of cards ---- */}
      <div
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseUp={(e) => onDragEnd(e.clientX)}
        onMouseLeave={(e) => onDragEnd(e.clientX)}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientX)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`grid gap-4 ${
              cols === 1
                ? "grid-cols-1"
                : cols === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {visibleItems.map((item, i) => (
              <div
                key={item.id}
                className="relative group rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-lg shadow-black/40 cursor-pointer"
                onClick={() => onOpenFullscreen(page * cols + i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src!}
                  alt={item.alt || `Screenshot ${page * cols + i + 1}`}
                  className="w-full h-auto block pointer-events-none"
                  draggable={false}
                />

                {/* hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40">
                  <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* client name */}
                {item.client && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                    {item.client}
                  </div>
                )}
              </div>
            ))}

            {/* ghost cards to keep grid shape on last page */}
            {Array.from({ length: cols - visibleItems.length }).map((_, i) => (
              <div key={`ghost-${i}`} className="rounded-2xl bg-zinc-900/30 border border-white/5" />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ---- Prev / Next ---- */}
      {totalPages > 1 && (
        <>
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg"
            aria-label="Sebelumnya"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages - 1}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 h-9 w-9 rounded-full bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-lg"
            aria-label="Berikutnya"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* ---- Dot indicators ---- */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === page
                  ? "w-6 h-2 bg-yellow-400"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Halaman ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ---- Counter ---- */}
      <p className="text-center text-xs text-gray-500 mt-2">
        {Math.min(page * cols + cols, items.length)} / {items.length} screenshot
      </p>
    </div>
  );
}

/* ================= FULLSCREEN LIGHTBOX ================= */
function FullscreenLightbox({
  items,
  initialIndex,
  onClose,
}: {
  items: Testimoni[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const dragStartX = useRef(0);
  const dragDelta = useRef(0);

  const goTo = (index: number) =>
    setCurrentIndex(Math.max(0, Math.min(index, items.length - 1)));

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const handleDragEnd = (clientX: number) => {
    const delta = clientX - dragStartX.current;
    if (delta < -50) goNext();
    else if (delta > 50) goPrev();
    dragDelta.current = 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      {/* Header bar */}
      <div
        className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white/60 text-sm">
          {currentIndex + 1} / {items.length}
        </span>
        {items[currentIndex].client && (
          <span className="text-white text-sm font-medium">
            {items[currentIndex].client}
          </span>
        )}
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          aria-label="Tutup"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Main image */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl h-[75vh] px-16"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => { dragStartX.current = e.clientX; }}
          onMouseUp={(e) => handleDragEnd(e.clientX)}
          onTouchStart={(e) => { dragStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
        >
          <Image
            src={items[currentIndex].src!}
            alt={items[currentIndex].alt || `Screenshot ${currentIndex + 1}`}
            fill
            className="object-contain"
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Nav buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        disabled={currentIndex === 0}
        className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        aria-label="Sebelumnya"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        disabled={currentIndex === items.length - 1}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
        aria-label="Berikutnya"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div
          className="absolute bottom-4 inset-x-0 flex justify-center gap-2 px-4 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => goTo(i)}
              className={`relative flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === currentIndex
                  ? "border-yellow-400 opacity-100 scale-110"
                  : "border-white/20 opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={item.src!}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
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

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
      {/* ---- Hero ---- */}
      <section className="relative w-full h-[50vh] md:h-[60vh] mb-20">
        <Image
          src="/images/design/2.png"
          alt="Hero Testimoni"
          fill
          priority
          className="object-cover"
        />
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

      {loading && <p className="text-center text-gray-400 mt-10">Memuat...</p>}
      {error && <p className="text-center text-red-500 mt-10">{error}</p>}

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

          {/* ================= SS CHAT — CAROUSEL MODAL ================= */}
          {sschat.length > 0 && (
            <section>
              <h2 className="text-3xl md:text-4xl font-semibold mb-8 text-center text-white">
                Screenshot Chat Klien
              </h2>

              <div className="px-6">
                <ScreenshotCarousel
                  items={sschat}
                  onOpenFullscreen={(index) => setLightboxIndex(index)}
                />
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

      {/* ================= FULLSCREEN LIGHTBOX ================= */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <FullscreenLightbox
            items={sschat}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}