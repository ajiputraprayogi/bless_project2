"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import Image from "next/image";

// Definisi tipe untuk member tim
type TeamMember = {
  id: number;
  title: string;
  desc: string;
  img: string;
  size?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TeamPage() {
  const { data, error, isLoading } = useSWR<TeamMember[]>("/api/tim", fetcher, {
    dedupingInterval: 24 * 60 * 60 * 1000, // cache 1 hari
    revalidateOnFocus: false,
  });

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2f3542] py-20 px-4 md:px-12 md:mt-3">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#2f3542]">
          Tim Kami
        </h2>
        <p className="text-[#a4b0be] mt-2">
          Orang-orang di balik karya terbaik kami
        </p>
      </div>

      {isLoading ? (
        // Loading state
        <div className="min-h-[60vh] flex items-center justify-center text-[#a4b0be]">
          <div className="loader border-4 border-[#a4b0be] border-t-transparent rounded-full w-10 h-10 animate-spin"></div>
        </div>
      ) : error ? (
        // Error state
        <div className="min-h-[60vh] flex items-center justify-center text-red-500 font-semibold">
          Gagal memuat data tim.
        </div>
      ) : (
        // Data tim grid
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[280px] sm:auto-rows-[320px] grid-flow-dense"
        >
          {data?.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`relative overflow-hidden rounded-2xl bg-[#f5f5f0] border border-[#e0e0da] group ${member.size ?? ""}`}
            >
              <Image
                src={member.img}
                alt={member.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2f3542]/80 via-[#2f3542]/30 to-transparent flex flex-col justify-end p-5">
                <h3 className="text-lg font-semibold text-[#F7F4EF] drop-shadow-md">
                  {member.title}
                </h3>
                <p className="text-[#a4b0be] text-sm">{member.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
