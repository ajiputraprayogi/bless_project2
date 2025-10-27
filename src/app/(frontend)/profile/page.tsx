"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"visi" | "misi" | null>(null);

  return (
    <div className="bg-gradient-to-b from-white via-[#F8F9FA] to-[#ECECEC] text-[#2F3542] min-h-screen py-16 px-3 md:px-12 lg:px-0 space-y-20">

      {/* Profil Perusahaan */}
      <section
        className="max-w-4xl mx-auto text-center space-y-6 mb-10"
        data-aos="fade-up"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-left md:text-center text-yellow-600 px-5 md:px-0">
          Profil Perusahaan
        </h2>

        <p className="text-gray-700 leading-relaxed text-left md:text-center px-5 md:px-0">
          <span className="text-yellow-600 font-semibold">Bless Kontraktor</span>{" "}
          hadir sebagai jawaban atas kebutuhan masyarakat akan layanan kontraktor
          dan desain bangunan yang tidak hanya fungsional, tetapi juga menghadirkan
          nilai estetika dan kemewahan.
          <br /><br />
          <span className="text-yellow-600 font-semibold">Bless Luxury Kontraktor</span>{" "}
          merupakan perusahaan konsultan jasa kontraktor pembangunan dan interior
          yang juga melayani jasa arsitek serta penyedia jasa desain. Kami hadir di
          tengah-tengah Anda untuk membantu mendesain dan berkomitmen membantu
          mewujudkan hunian sesuai yang diinginkan dengan dukungan tim solid dan
          berpengalaman.
          <br /><br />
          <span className="text-yellow-600 font-semibold">Bless Luxury Kontraktor</span>{" "}
          sudah berpengalaman dalam mendesain rumah, villa, residential / perumahan,
          dan bangunan komersial lainnya seperti ruko, kampus, caffe, apartemen, spa,
          kantor, kos, guest house, kompleks villa, resort hingga hotel sehingga kami
          dapat mendesain bangunan impian Anda sesuai standar keamanan, kualitas
          terbaik, dan budget yang sesuai.
          <br /><br />
          <span className="text-yellow-600 font-semibold">Bless Luxury Kontraktor</span>{" "}
          akan selalu mengedepankan pelayanan yang terbaik demi membuat seluruh klien
          merasa puas. Wujudkan hunian yang indah, nyaman, dan mewah bersama kami
          sekarang juga.
        </p>
      </section>

      {/* Visi Misi */}
      <section className="max-w-3xl mx-auto">
        <div className="flex justify-center gap-6 mb-8 relative flex-wrap">
          {/* Visi */}
          <div className="group relative">
            <button
              className="px-8 py-3 rounded-full font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition shadow-sm border border-yellow-200"
              onClick={() =>
                setActiveTab((prev) => (prev === "visi" ? null : "visi"))
              }
            >
              Visi
            </button>

            <div
              className={`absolute top-full mt-3 left-1/2 -translate-x-1/2 w-80 bg-white border border-yellow-100 p-5 rounded-xl shadow-lg transition-all duration-300 z-10
              ${activeTab === "visi"
                ? "opacity-100 visible"
                : "opacity-0 invisible"}`}
            >
              <p className="text-yellow-700 leading-relaxed">
                Menjadi perusahaan kontraktor dan desain bangunan terpercaya di
                Indonesia yang menghadirkan karya berkualitas tinggi, estetis,
                dan inovatif.
              </p>
            </div>
          </div>

          {/* Misi */}
          <div className="group relative">
            <button
              className="px-8 py-3 rounded-full font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition shadow-sm border border-yellow-200"
              onClick={() =>
                setActiveTab((prev) => (prev === "misi" ? null : "misi"))
              }
            >
              Misi
            </button>

            <div
              className={`absolute top-full mt-3 -translate-x-1/2 left-1/2 w-[22rem] bg-white border border-yellow-100 px-6 py-6 rounded-xl shadow-lg transition-all duration-300 z-10
              ${activeTab === "misi"
                ? "opacity-100 visible"
                : "opacity-0 invisible"}`}
            >
              <ul className="list-disc list-outside text-yellow-700 space-y-2">
                <li>
                  Memberikan layanan desain dan pembangunan yang detail,
                  transparan, dan profesional.
                </li>
                <li>
                  Menghadirkan solusi efisiensi biaya tanpa mengurangi kualitas hasil pekerjaan.
                </li>
                <li>
                  Menggunakan teknologi terbaru dalam visualisasi dan perencanaan proyek.
                </li>
                <li>
                  Membangun hubungan jangka panjang dengan klien melalui kepercayaan, kepuasan, dan integritas.
                </li>
                <li>
                  Mengembangkan tim yang kompeten, kreatif, dan berkomitmen tinggi dalam setiap proyek.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
