"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const portfolioData = [
  {
    id: 1,
    name: "Villa Savana",
    type: "Rumah",
    description:
      "Hunian tropis modern dengan konsep terbuka dan pencahayaan alami maksimal.",
    images: [
      "/images/design/1.png",
      "/images/design/2.png",
      "/images/design/3.png",
    ],
  },
  {
    id: 2,
    name: "Café Aurora",
    type: "Interior",
    description:
      "Desain interior hangat dengan nuansa kayu dan pencahayaan ambient.",
    images: [
      "/images/design/4.png",
      "/images/design/5.png",
      "/images/design/6.png",
    ],
  },
  {
    id: 3,
    name: "Studio Horizon",
    type: "Kantor",
    description:
      "Ruang kerja kreatif dengan layout fleksibel dan warna pastel lembut.",
    images: [
      "/images/design/7.png",
      "/images/design/8.png",
      "/images/design/9.png",
    ],
  },
];

export default function PortfolioPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = (length: number) => {
    setCurrentSlide((prev) => (prev + 1) % length);
  };

  const handlePrev = (length: number) => {
    setCurrentSlide((prev) => (prev - 1 + length) % length);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Portofolio Desain
        </h1>

        {/* GRID LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
              whileHover={{ scale: 1.02 }}
            >
              <Image
                src={item.images[0]}
                alt={item.name}
                width={500}
                height={300}
                className="w-full h-56 object-cover"
              />
              <div className="p-5 flex flex-col gap-3 flex-grow">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
                    {item.type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm flex-grow">
                  {item.description}
                </p>
                <button
                  onClick={() => {
                    setActiveIndex(index);
                    setCurrentSlide(0);
                  }}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition"
                >
                  Lihat lainnya
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL SLIDER */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-5 max-w-3xl w-full relative overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              {/* Close button */}
              <button
                onClick={() => setActiveIndex(null)}
                className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 rounded-full p-2"
              >
                ✕
              </button>

              {/* SLIDER CONTENT */}
              <div className="relative flex flex-col items-center">
                <div className="overflow-hidden w-full rounded-xl">
                  <motion.div
                    key={currentSlide}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image
                      src={
                        portfolioData[activeIndex].images[currentSlide]
                      }
                      alt="Slide"
                      width={800}
                      height={500}
                      className="w-full h-[400px] object-cover rounded-xl"
                    />
                  </motion.div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between w-full mt-5">
                  <button
                    onClick={() =>
                      handlePrev(portfolioData[activeIndex].images.length)
                    }
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl"
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    onClick={() =>
                      handleNext(portfolioData[activeIndex].images.length)
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    Selanjutnya →
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
