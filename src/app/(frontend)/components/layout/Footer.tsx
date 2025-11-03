"use client";

import React from "react";
import {  FaFacebookF  } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";

import { FaBuilding, FaUsersCog, FaDraftingCompass, FaPhone, FaWhatsapp, FaInstagram, FaFacebook, FaTiktok, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
         <footer className="bg-gray-900 text-white mt-auto">
           <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Logo & Description */}
             <div className="space-y-4">
               <Image
                 src="/images/brand/logos.png"
                 alt="Bless Architect Logo Footer"
                 width={50}
                 height={50}
               />
               <p>Bless Architect merupakan perusahaan konsultan jasa arsitek yang menyediakan jasa desain, kontraktor pembangunan, dan interior & furniture.</p>
               <div className="flex gap-4 text-xl text-white">
                 <a href="https://www.instagram.com/Bless_architect/" target="_blank"><FaInstagram /></a>
                 <a href="https://instagram.com/Bless_construction?utm_medium=copy_link" target="_blank"><FaInstagram /></a>
                 <a href="https://www.facebook.com/jasaarsitek.kedirijawatimur" target="_blank"><FaFacebook /></a>
                 <a href="https://www.tiktok.com/@Bless.arsitek?lang=id-ID" target="_blank"><FaTiktok /></a>
                 <a href="https://www.youtube.com/channel/UCscxnyb5CbEagKqitQlKCqA" target="_blank"><FaYoutube /></a>
               </div>
             </div>
   
             {/* Kontak */}
             <div className="space-y-2">
               <h4 className="font-semibold mb-8 text-xl">Kontak Kami</h4>
               <p>Whatsapp: <a href="https://api.whatsapp.com/send?phone=6281555700600" className="text-orange-400">081555700600</a></p>
               <p>Telepon: <a href="tel:082287777600" className="text-orange-400">082287777600</a></p>
               <p>Email: <a href="mailto:Blessmanagement@gmail.com" className="text-orange-400">Blessmanagement@gmail.com</a></p>
               <p>Alamat: Jl. Mayor Bismo No.279, Semampir, Kec. Kota, Kabupaten Kediri, Jawa Timur 64121</p>
             </div>
   
             {/* Lokasi */}
             <div>
               <h4 className="font-semibold mb-2 text-xl">Lokasi Kantor</h4>
               <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.956353020488!2d112.00941230000001!3d-7.7944462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78579e7d171915%3A0xc259f859b31dac69!2sBless%20Kontraktor!5e0!3m2!1sid!2sid!4v1762187066556!5m2!1sid!2sid"
                 width="100%"
                 height={200}
                 style={{ border: 0 }}
                 allowFullScreen
                 loading="lazy"
               ></iframe>
             </div>
           </div>
   
           <div className="bg-gray-800 text-center py-4 text-sm">
             © 2025 All right reserved.
           </div>
         </footer>
  );
}