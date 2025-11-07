"use client";

import { User, Shield, Clock, Lightbulb, Handshake } from "lucide-react";

const features = [
  {
    icon: User,
    label: "Profesionalisme dan Pengalaman",
  },
  {
    icon: Shield,
    label: "Kualitas Terjamin",
  },
  {
    icon: Clock,
    label: "Tepat Waktu dan Efisien",
  },
  {
    icon: Lightbulb,
    label: "Solusi Terbaik untuk Setiap Kebutuhan",
  },
  {
    icon: Handshake,
    label: "Transparansi dan Kepercayaan",
  },
];

const WhyChooseUs = () => {
  return (
    <section
      className="
        relative 
        text-white 
        py-20 
        md:py-24 
        px-6 
        bg-fixed 
        bg-center 
        bg-cover 
        bg-no-repeat 
        overflow-hidden
      "
      style={{
        backgroundImage: "url('/images/design/2.png')", // ganti sesuai path gambar kamu
      }}
    >
      {/* Overlay hitam transparan biar teks tetap kebaca */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      {/* Konten utama */}
      <div className="relative max-w-7xl mx-auto z-10">
        {/* Judul */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-white">
          Mengapa <span className="text-yellow-400">Memilih Kami?</span>
        </h2>

        {/* Container fitur */}
        <div className="flex flex-wrap justify-center gap-8 lg:grid lg:grid-cols-5 lg:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 w-full sm:w-1/2 md:w-1/3 lg:w-auto"
            >
              {/* Icon dalam lingkaran */}
              <div className="bg-white/90 text-[#2f3542] p-5 rounded-full mb-4 inline-flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                <feature.icon className="w-8 h-8" />
              </div>

              {/* Label */}
              <p className="font-medium text-yellow-400 text-lg drop-shadow-md">
                {feature.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
