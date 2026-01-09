"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Video {
  link: string;
}

export default function YoutubeApiPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fungsi untuk ambil videoId dari link
  const getVideoId = (link: string) => {
    try {
      const url = new URL(link);
      if (url.hostname.includes("youtu.be")) {
        // short link
        return url.pathname.slice(1);
      } else if (url.hostname.includes("youtube.com")) {
        return url.searchParams.get("v");
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // 🔥 Fetch dari API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/link_animasi"); // endpoint API
        if (!res.ok) throw new Error("Gagal fetch video");
        const data: Video[] = await res.json();
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="flex flex-col items-center w-full bg-black">
      {/* HERO SECTION */}
      <section className="relative w-full h-[50vh] md:h-[60vh]">
        <Image
          src="/images/design/2.png"
          alt="Background Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white text-center px-4 font-semibold">
            Desain Animasi
          </h1>
        </div>
      </section>

      {/* YOUTUBE VIDEOS SECTION */}
      <section className="w-full max-w-6xl px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Animasi 3D
        </h2>

        {loading ? (
          <p className="text-gray-500 text-lg text-center">Memuat video...</p>
        ) : videos.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">Tidak ada video tersedia</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, idx) => {
              const id = getVideoId(video.link);
              if (!id) return null;

              return (
                <div
                  key={idx}
                  className="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black hover:scale-[1.02] transition-transform duration-300"
                >
                  <iframe
                    src={`https://www.youtube.com/embed/${id}`}
                    title={`YouTube video ${idx}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
