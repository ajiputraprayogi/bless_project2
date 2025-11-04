"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaTiktok,
  FaEnvelope,
} from "react-icons/fa";
import Link from "next/link";

// ✅ Tipe sesuai dummy API baru
type Contact = {
  name: string;
  username: string;
  link: string;
  icon: "instagram" | "whatsapp" | "facebook" | "tiktok" | "email";
  color: string;
};

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch("/dummyapi/kontak");
        if (!res.ok) throw new Error("Failed to fetch contacts");
        const data: Contact[] = await res.json();
        setContacts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchContacts();
  }, []);

  const iconMap: Record<Contact["icon"], React.ReactNode> = {
    instagram: <FaInstagram className="text-2xl text-[#E4405F]" />,
    whatsapp: <FaWhatsapp className="text-2xl text-[#25D366]" />,
    facebook: <FaFacebookF className="text-2xl text-[#1877F2]" />,
    tiktok: <FaTiktok className="text-2xl text-[#010101]" />,
    email: <FaEnvelope className="text-2xl text-[#2F3542]" />,
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#F7F4EF] text-[#2F3542] p-6 pt-[8rem] md:pt-[5rem]">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl rounded-2xl shadow-md overflow-hidden border border-[#E4E6EB]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left - Info Brand */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 relative">
                  <Image
                    src="/images/brand/logos.png"
                    alt="Bless Design Logo"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-[#2F3542]">
                    Bless Design
                  </h1>
                  <p className="text-sm text-[#A4B0BE]">
                    Modern architecture & interior design
                  </p>
                </div>
              </div>

              <p className="mt-6 leading-relaxed text-[#2F3542]/80">
                Butuh kerjasama atau ngobrol soal desain?
                <br />
                Kami terbuka untuk konsultasi desain, request style arsitek, dan
                kolaborasi proyek.
              </p>
            </div>
          </div>

          {/* Right - Contact Cards */}
          <div className="p-8 border-t md:border-t-0 md:border-l border-[#E4E6EB] bg-[#F7F4EF]">
            <h2 className="text-lg font-medium text-[#2F3542]">Kontak</h2>
            <p className="text-sm text-[#A4B0BE] mt-1">
              Pilih platform favorit kamu — kami siap merespons dengan cepat.
            </p>

            {loading ? (
              <div className="mt-6 text-sm text-[#A4B0BE]">
                Memuat kontak...
              </div>
            ) : (
              <div className="mt-6 grid gap-3">
                {contacts.map((c) => (
                  <Link
                    key={c.name}
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-4 p-4 rounded-xl ring-1 ring-[#E4E6EB] hover:shadow-sm transition ${c.color}`}
                  >
                    {iconMap[c.icon]}
                    <div>
                      <div className="text-sm font-medium text-[#2F3542]">
                        {c.name}
                      </div>
                      <div className="text-xs text-[#A4B0BE]">{c.username}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.section>
    </main>
  );
}
