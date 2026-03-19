"use client";

import { motion } from "framer-motion";
import KelebihanKekuranganPage from "../kelebihan";

export default function FurnitureHero() {
  return (
    <section className="relative h-auto overflow-hidden flex flex-col items-center justify-center">
      {/* Background image + overlay */}
      <div
        className="absolute inset-0 bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/design/villa1.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-12 text-white">

        {/* Right: Services boxes */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid gap-6"
        >
          {/* Service 1 */}
          <div className="bg-transparent p-6 transition-all border-b">
            <h3 className="text-3xl font-semibold mb-2">Jasa Desain Arsitek</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Wujudkan rumah impian Anda bersama tim arsitek profesional kami. Desain bisa disesuaikan dengan kebutuhan, gaya hidup, dan budget, dengan hasil yang indah, fungsional, dan nyaman untuk jangka panjang.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-transparent p-6 transition-all border-b">
            <h3 className="text-xl font-semibold mb-2">Kontraktor Pembangunan</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Bangun rumah tanpa ribet dan penuh kepastian. Kami menangani proses pembangunan secara profesional dengan kualitas kerja rapi, material terpilih, dan hasil bangunan yang kuat, aman, serta tepat waktu.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-transparent p-6 transition-all border-b">
            <h3 className="text-xl font-semibold mb-2">Interior</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Lengkapi hunian Anda dengan desain interior yang serasi dan elegan. Kami melayani rumah pribadi hingga bangunan komersial dengan berbagai pilihan gaya, sesuai karakter dan keinginan Anda.
            </p>
          </div>
        </motion.div>

                {/* Left: Main title & description */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center"
        >
          <p className="uppercase tracking-[3px] text-gray-300 mb-3">Layanan Kami</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Bless Arsitek & Kontraktor - Jasa Arsitek Kontraktor dan Interior
          </h1>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Kami akan mewujudkan hunian dengan konsep desain yang bisa direquest sesuai keinginan
            sesuai standar arsitektur supaya dapat menghasilkan hunian yang indah, aman, dan nyaman.
          </p>
<button
  onClick={() =>
    window.open(
      "https://wa.me/6285176965609?text=Halo%2C%20saya%20mau%20tanya%20mengenai%20layanan%20bless%20arsitek%20dan%20kontraktor",
      "_blank"
    )
  }
  className="bg-yellow-500 hover:bg-yellow-600 transition-colors text-black font-semibold px-6 py-3 rounded-md w-max"
>
  HUBUNGI ARSITEK
</button>

        </motion.div>

        {/* Optional tambahan komponen */}
      </div>
        <KelebihanKekuranganPage />
    </section>
  );
}
