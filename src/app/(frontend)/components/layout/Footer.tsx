"use client";

import React from "react";
import { FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative text-white mt-auto">
      {/* Background parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/images/design/17.png')",
        }}
      >
        {/* Overlay semi-gelap */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Logo & Description */}
        <div className="space-y-4">
          <Image
            src="/logo.png"
            alt="Bless Kontraktor Logo Footer"
            width={50}
            height={50}
          />
          <p className="text-white/90">
            Bless Arsitek & Kontraktor adalah jasa di bidang desain dan konstruksi yang menyediakan layanan pembangunan baru, renovasi, serta desain interior dan eksterior hingga tahap pelaksanaan
          </p>
          {/* <div className="flex gap-4 text-xl text-white/90">
            <a href="https://www.instagram.com/Bless_Kontraktor/"><FaInstagram /></a>
            <a href="https://instagram.com/Bless_construction?utm_medium=copy_link"><FaInstagram /></a>
            <a href="https://www.facebook.com/jasaarsitek.kedirijawatimur"><FaFacebook /></a>
            <a href="https://www.tiktok.com/@Bless.arsitek?lang=id-ID"><FaTiktok /></a>
            <a href="https://www.youtube.com/channel/UCscxnyb5CbEagKqitQlKCqA"><FaYoutube /></a>
          </div> */}
          <div className="flex gap-4 text-xl text-white/90">
            {/* <Link href="https://www.instagram.com/Bless_Kontraktor/"><FaInstagram /></Link> */}
            <Link href="/kontak"><FaInstagram /></Link>
            <Link href="/kontak"><FaFacebook /></Link>
            <Link href="/kontak"><FaTiktok /></Link>
            <Link href="/https://youtube.com/@bless.kontraktor?si=Vk3jstmon2gWMH7z"><FaYoutube /></Link>
          </div>
        </div>

        {/* Kontak */}
        <div className="space-y-2">
          <h4 className="font-semibold mb-8 text-xl">Kontak Kami</h4>
          <p>
            Whatsapp: <a href="https://api.whatsapp.com/send?phone=6285176965609" className="text-orange-400">0856-0672-5609</a>
          </p>
                    <p>
            Whatsapp: <a href="https://api.whatsapp.com/send?phone=6285176965609" className="text-orange-400">0851-7696-5609</a>
          </p>
          <p>
            Email: <a href="mailto:Blessmanagement@gmail.com" className="text-orange-400">blesskontraktor@gmail.com</a>
          </p>
          <p>Alamat: Jl. Mayor Bismo No.279, Semampir, Kec. Kota, Kabupaten Kediri, Jawa Timur 64121</p>
        </div>

        {/* Lokasi */}
        <div>
          <h4 className="font-semibold mb-2 text-xl">Lokasi Kantor</h4>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.956353020488!2d112.00941230000001!3d-7.7944462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78579e7d171915%3A0xc259f859b31dac69!2sBless%20Kontraktor!5e0!3m2!1sid!2sid!4v1762187066556!5m2!1sid!2sid"
            width="100%"
            height={200}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>

      <div className="bg-black/50 text-center py-4 text-sm text-white/80">
        © 2025 All rights reserved.
      </div>
    </footer>
  );
}
