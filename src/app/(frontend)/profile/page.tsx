"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FaBuilding, FaUsersCog, FaDraftingCompass, FaPhone, FaWhatsapp, FaTools, FaPlus, FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";

const features = [
  {
    title: "Desain & Perencanaan",
    description: "Kami akan membantu Anda mendapatkan hasil yang Anda impikan",
    icon: FaBuilding,
  },
  {
    title: "Tim Profesional",
    description: "Kami telah didukung dengan tim yang berpengalaman & profesional",
    icon: FaUsersCog,
  },
  {
    title: "Request Desain",
    description: "Anda bisa request desain apapun yang Anda ingin wujudkan",
    icon: FaDraftingCompass,
  },
    {
    title: "Build",
    description: "Kami akan merealisasikan mewujudkan rumah impian anda baik bangun baru ataupun renovasi",
    icon: FaTools,
  },
];

export default function ProfilPerusahaan() {
  return (
    <div className="relative bg-white min-h-screen flex flex-col">
      {/* Floating WA & Phone */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {/* <a href="tel:082287777600" target="_blank" className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <FaPhone className="text-white text-2xl" />
        </a> */}
        <a href="https://api.whatsapp.com/send?phone=6282224015802" target="_blank" className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg">
          <FaWhatsapp className="text-white text-2xl" />
        </a>
      </div>

      <section className="relative w-full h-[50vh]">
        <Image
          src="/images/design/1.png"
          alt="Background Hero"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white text-center px-4">
            Profil Perusahaan Bless Kontraktor
          </h1>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl shadow hover:shadow-lg transition"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 mb-4 flex items-center justify-center text-orange-500 text-4xl">
                  <Icon />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Company Profile */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Kiri: Logo + Portofolio */}
          <div className="flex flex-col items-start gap-6 md:w-1/3">
            {/* Logo */}
            <div className="bg-black p-4">
              <Image
                src="/images/brand/logos.png"
                alt="Bless Kontraktor Logo"
                width={350}
                height={120}
              />
            </div>

            {/* Kotak Portofolio 2x2 */}
            {/* <div className="grid grid-cols-2 gap-2 w-full">
              <div className="bg-gray-200 h-30">
                <Image
                  src="/images/design/1.png"
                  alt="Portofolio 1"
                  width={150}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="bg-gray-200 h-30">
                <Image
                  src="/images/design/2.png"
                  alt="Portofolio 2"
                  width={150}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="bg-gray-200 h-30">
                <Image
                  src="/images/design/3.png"
                  alt="Portofolio 3"
                  width={150}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="bg-gray-200 h-30">
                <Image
                  src="/images/design/4.png"
                  alt="Portofolio 4"
                  width={150}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </div>
            </div> */}
          </div>

          {/* Kanan: Teks */}
          <div className="text-gray-700 text-justify md:w-2/3 space-y-4 text-2md">
            <p>
              <strong>Bless Kontraktor</strong> merupakan perusahaan konsultan jasa arsitek yang menyediakan jasa desain, kontraktor pembangunan, dan interior & furniture. Kami hadir di tengah-tengah Anda untuk membantu mendesain hunian serta keseluruhan ruang bangunan yang diinginkan.
            </p>
            <p>
              <strong>Bless Kontraktor</strong> telah berdiri sejak Juni 2014 dengan komitmen ingin membantu mewujudkan impian semua orang untuk memiliki hunian sesuai keinginan. Kami melayani jasa arsitek, kontraktor, dan interior & furniture  dengan dukungan tim solid profesional dan berpengalaman.
            </p>
            <p>
              <strong>Bless Kontraktor</strong> berpengalaman mendesain rumah, villa, perumahan, ruko, kampus, apartemen, spa, kantor, kos, guest house, kompleks villa, resort, hingga hotel. Semua desain mengikuti standar keamanan, kualitas terbaik, dan budget yang pas.
            </p>
            <p>
              <strong>Bless Kontraktor</strong> selalu mengedepankan kualitas dan pelayanan terbaik demi membuat seluruh klien merasa puas. Wujudkan hunian yang indah dan nyaman bersama kami sekarang juga.
            </p>
          </div>
        </div>
      </section>


      {/* Portfolio Section */}
      {/* <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-8 text-center">Portofolio Kami</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              className="overflow-hidden rounded-lg shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={`/images/design/${i}.png`}
                alt={`Design ${i}`}
                width={400}
                height={300}
                className="object-cover w-full h-60"
              />
            </motion.div>
          ))}
        </div>
      </section> */}

    </div>
  );
}
