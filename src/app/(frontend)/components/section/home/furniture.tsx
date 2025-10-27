"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function FurnitureHero() {
  return (
    <section className="relative h-[120vh] overflow-hidden flex items-center justify-center">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/design/villa1.jpg')", // ganti sesuai path gambarmu
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 max-w-5xl px-6 text-center text-[#DFE4EA]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="uppercase tracking-[4px] text-[#A4B0BE] mb-4"
        >
          Layanan Kami
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-semibold text-white mb-8"
        >
          Bless Kontraktor
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-[#DFE4EA]/90 mb-10 leading-relaxed"
        >
          Jasa Arsitek Kontraktor dan Interior Furniture
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 text-left mt-10">
          {/* Jasa Desain */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#2F3542]/70 backdrop-blur-sm p-6 rounded-xl hover:bg-[#2F3542]/90 transition-all"
          >
            <h3 className="text-xl font-semibold text-[#DFE4EA] mb-3">
              Jasa Desain Arsitek
            </h3>
            <p className="text-sm text-[#A4B0BE] leading-relaxed">
              Kami akan mewujudkan hunian dengan konsep desain yang bisa direquest sesuai keinginan dan standar arsitektur agar menghasilkan hunian yang indah, aman, dan nyaman.
            </p>
          </motion.div>

          {/* Kontraktor */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#2F3542]/70 backdrop-blur-sm p-6 rounded-xl hover:bg-[#2F3542]/90 transition-all"
          >
            <h3 className="text-xl font-semibold text-[#DFE4EA] mb-3">
              Kontraktor Pembangunan
            </h3>
            <p className="text-sm text-[#A4B0BE] leading-relaxed">
              Kami berkomitmen memberikan hasil pembangunan bermutu tinggi dengan memperhatikan keindahan, kenyamanan, dan ketahanan bangunan sebagai prioritas utama.
            </p>
          </motion.div>

          {/* Interior */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-[#2F3542]/70 backdrop-blur-sm p-6 rounded-xl hover:bg-[#2F3542]/90 transition-all"
          >
            <h3 className="text-xl font-semibold text-[#DFE4EA] mb-3">
              Interior & Furniture
            </h3>
            <p className="text-sm text-[#A4B0BE] leading-relaxed">
              Kami melayani segala bentuk dan style hunian — pribadi maupun komersial — mulai dari urban, eco, modern, tradisional, mediterania, hingga gaya Bali.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
