"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const interiorImages = [
  { 
    src: "/images/interior/fur1.jpg", 
    title: "Ruang Tamu Elegan",
    subtitle: "Sentuhan klasik dalam nuansa modern",
  },
  { 
    src: "/images/interior/fur2.jpg", 
    title: "Sofa Modern",
    subtitle: "Rapi, hangat, dan berkarakter",
  },
  { 
    src: "/images/interior/fur3.jpg", 
    title: "Sofa Tidur Hangat",
    subtitle: "Desain nyaman untuk istirahat berkualitas",
  },
  { 
    src: "/images/interior/fur4.jpg",  
    title: "Ruang Kerja Mewah",
    subtitle: "Kombinasi produktivitas & estetika",
  },
  { 
    src: "/images/interior/fur1.jpg", 
    title: "Kamar Minimalis",
    subtitle: "Simpel, bersih, elegan",
  },
  { 
    src: "/images/interior/fur2.jpg", 
    title: "Furnitur Klasik Modern",
    subtitle: "Perpaduan material premium dan timeless",
  },
];

export default function InteriorPage() {
  return (
    <main className="min-h-screen bg-[#DFE4EA] text-[#2F3542] px-6 md:px-10 lg:px-20 py-20 md:mt-3">
      {/* Header Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto text-center mb-16"
      >
        <p className="text-sm tracking-[3px] text-[#A4B0BE] uppercase">
          Sentuhan Desain Modern
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold mb-4 text-[#2F3542]">
          Interior & Furniture
        </h1>
        <p className="text-base md:text-lg text-[#57606F]">
          Eksplor inspirasi desain ruangan dan furnitur dengan gaya modern yang bersih dan elegan.
        </p>
      </motion.section>

      {/* Gallery Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {interiorImages.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group cursor-pointer overflow-hidden bg-[#A4B0BE]/20 border border-[#A4B0BE]/30 shadow-sm hover:shadow-md transition-all duration-500"
          >
            <div className="relative h-[260px] w-full">
              <Image
                src={item.src}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-[#2F3542]/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /> */}
            </div>

            <div className="p-5 text-left">
              <h3 className="text-lg font-semibold text-[#2F3542] group-hover:text-[#57606F] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[#57606F] mt-1">
                {item.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
