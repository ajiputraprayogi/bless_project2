"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type CounterProps = {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  start: boolean;
};

function Counter({ from, to, duration = 5, suffix = "", start }: CounterProps) {
  const count = useMotionValue(from);
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    if (!start) return;
    const controls = animate(count, to, {
      duration,
      onUpdate(value) {
        setDisplay(Math.floor(value));
      },
    });
    return controls.stop;
  }, [start, count, to, duration]);

  return (
    <motion.span>
      {display}
      {suffix}
    </motion.span>
  );
}

export default function TentangKamiPage() {
  const stats = [
    { label: "Klien Puas", from: 0, to: 120 },
    { label: "Tahun Pengalaman", from: 0, to: 8 },
    { label: "Proyek Selesai", from: 0, to: 250 },
  ];

  const [resetKey, setResetKey] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  // Reset animasi kalau scroll ke atas (window.scrollY === 0)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setResetKey((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main
      key={resetKey}
      className="min-h-[50vh] flex flex-col items-center justify-center bg-[#F7F4EF] text-[#2E2B25] mb-5"
    >
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
        ref={ref}
      >
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          Pencapaian Kami
        </h1>
        <p className="text-base opacity-80 mb-10">
          Kami telah bertahun-tahun memberikan layanan desain arsitektur dan interior berkualitas tinggi. 
          Berikut beberapa pencapaian yang telah kami raih sejauh ini.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="text-4xl md:text-5xl font-bold">
                <Counter from={item.from} to={item.to} start={inView} />
              </div>
              <div className="text-sm md:text-base mt-2 opacity-70">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}
