"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";

const portfolioList = [
    { id: 1, title: "Renovasi Rumah", img: "/images/design/1.png" },
    { id: 2, title: "Villa Modern", img: "/images/design/2.png" },
    { id: 3, title: "Ruko Komersial", img: "/images/design/3.png" },
    { id: 4, title: "Kantor Minimalis", img: "/images/design/4.png" },
    { id: 5, title: "Perbaikan Interior", img: "/images/design/5.png" },
];

export default function JasaKontraktorPage() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    return (
        <>
            <section className="relative w-full h-[50vh]">
                <Image
                    src="/images/design/1.png"
                    alt="Background Hero"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h1 className="text-4xl md:text-5xl text-white text-center px-4">
                        Arsitek
                    </h1>
                </div>
            </section>
            <section className="max-w-6xl mx-auto px-4 py-20 mt-3">
                {/* Teks deskriptif */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-gray-700 mb-12"
                >
                    <p className="mb-4">
                        <strong>Bless Architect</strong> menyediakan layanan jasa arsitek yang dilengkapi dengan tim yang sudah berpengalaman dan profesional. Kami dapat membantu Anda untuk mendesain rumah, villa, kost, apartemen, residence, kantor, cafe, dan bangunan-bangunan lainnya.
                    </p>
                    <p className="mb-4">
                        Kami akan membantu Anda mewujudkan hunian dengan konsep desain yang bisa direquest sesuai keinginan dan yang pasti kami akan mengerjakannya sesuai dengan standar arsitektur yang ada supaya dapat menghasilkan hunian yang indah, aman, dan nyaman.
                    </p>
                    <p>
                        Kami melayani seluruh wilayah Indonesia, Anda bisa konsultasi by online tanpa ribet & terpercaya. Bless Architect adalah solusi terbaik untuk mewujudkan rumah tinggal yang Anda impikan.
                    </p>
                </motion.div>

                {/* Card scroll horizontal */}
                <div className="relative">
                    {/* Button geser kiri */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 z-10 hover:bg-gray-100 transition"
                    >
                        ◀
                    </button>

                    {/* Scroll container */}
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2"
                    >
                        {portfolioList.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="min-w-[220px] bg-white overflow-hidden flex-shrink-0 hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="relative h-36 w-full">
                                    <Image
                                        src={item.img}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Button geser kanan */}
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 z-10 hover:bg-gray-100 transition"
                    >
                        ▶
                    </button>
                </div>
            </section>
        </>
    );
}
