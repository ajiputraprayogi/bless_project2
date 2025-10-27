"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center bg-[#a4b0be] text-[#2E2B25] overflow-hidden">
      {/* Animated Circle Background */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center -z-10"
      >
        <div className="w-[60vw] max-w-[600px] aspect-square rounded-full bg-[#C9A77A]/10 blur-3xl" />
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-[2.5rem] sm:text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-bold tracking-tight leading-tight mb-4 max-w-[90%]"
      >
        Waduh Nyasar Nih 
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-base sm:text-lg md:text-xl text-[#2E2B25]/70 max-w-[90%] sm:max-w-md"
      >
        Halaman yang kamu cari sepertinya masih dalam pengembangan,  
        atau mungkin nyasar ke dimensi lain.  
        Tapi tenang — kita bantu kamu balik ke beranda.
      </motion.p>

      {/* Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-3xl bg-[#D7B899] font-medium w-auto transition-all duration-500 hover:scale-[1.03]"
        >
          <div className="inline-flex h-11 sm:h-12 items-center justify-center px-8 text-[#2E2B25] transition-all duration-500 group-hover:-translate-y-[150%]">
            Balik Yuk
          </div>

          <div className="absolute inline-flex h-24 w-full translate-y-[100%] items-center justify-center text-[#2E2B25] transition-all duration-500 group-hover:translate-y-0">
            <span className="absolute h-full w-full translate-y-full skew-y-12 scale-y-0 bg-[#C9A77A] transition-all duration-500 group-hover:translate-y-0 group-hover:scale-150"></span>
            <span className="z-10 px-8">Gaskeun </span>
          </div>
        </Link>
      </div>

      {/* Decorative Glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 sm:bottom-12 w-[30vw] max-w-[250px] aspect-square bg-[#C9A77A]/30 blur-[120px] rounded-full"
      />
    </main>
  );
}
