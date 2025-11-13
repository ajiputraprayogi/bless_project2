"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

export default function OrderForm() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    phone: "",
    jenisDesain: "",
    lantai: "",
    ukuran: "",
    paket: "",
    budget: "",
    alamat: "",
  });

  const nomorAdmin = "6285176965609"; 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const pesan = `
*Form Order Jasa Arsitek - Bless Kontraktor*
--------------------------------
1. Nama Lengkap: ${formData.nama}
2. Email: ${formData.email}
3. No. HP/WA: ${formData.phone}
4. Jenis Desain: ${formData.jenisDesain}
5. Jumlah Lantai: ${formData.lantai}
6. Ukuran Lahan: ${formData.ukuran}
7. Paket Desain: ${formData.paket}
8. Rencana Budget: ${formData.budget}
9. Alamat Project: ${formData.alamat}
`;

    const url = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="min-h-screen w-full bg-transparent text-gray-800 px-3 py-10">
      <div className="w-full mx-auto grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2 bg-transparent rounded-2xl p-6 md:p-10">
          <h1 className="text-3xl font-bold mb-8 text-center text-amber-600">
            Form Order Bless Kontraktor
          </h1>

          <form onSubmit={handleSubmit} className="grid gap-5">
            {/* Input umum */}
            {[
              {
                label: "Nama Lengkap *",
                name: "nama",
                type: "text",
                placeholder: "Nama Lengkap",
              },
              {
                label: "Email *",
                name: "email",
                type: "email",
                placeholder: "Email aktif",
              },
              {
                label: "No. HP / WA *",
                name: "phone",
                type: "tel",
                placeholder: "+62...",
              },
              {
                label: "Ukuran Lahan (Panjang x Lebar) m / Luas m²",
                name: "ukuran",
                type: "text",
                placeholder: "Kosongkan jika belum diketahui",
              },
              {
                label: "Alamat Project *",
                name: "alamat",
                type: "text",
                placeholder: "Provinsi / Kota",
              },
            ].map((field, i) => (
              <div key={i}>
                <label className="block mb-1 font-semibold text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  required={field.label.includes("*")}
                  className="w-full rounded-xl px-4 py-3 bg-transparent border border-gray-300
                             placeholder:text-gray-400 transition"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            {/* Custom Select */}
            {[
              {
                label: "Jenis Desain Bangunan",
                name: "jenisDesain",
                options: ["Rumah", "Villa", "Ruko", "Apartemen", "Kos", "Hotel"],
                required: true,
              },
              {
                label: "Jumlah Lantai Bangunan",
                name: "lantai",
                options: ["1 Lantai", "2 Lantai", "3 Lantai", "4+ Lantai"],
              },
              {
                label: "Jenis Paket Desain",
                name: "paket",
                options: [
                  "Paket Arsitek",
                  "Paket Interior",
                  "Paket Arsitek + Interior",
                ],
              },
              {
                label: "Rencana Budget Pembangunan",
                name: "budget",
                options: [
                  "< 500 Juta",
                  "500 Juta - 1 M",
                  "1 M - 3 M",
                  "3 M - 5 M",
                  "> 5 M",
                ],
                required: true,
              },
            ].map((field, i) => (
              <div key={i}>
                <label className="block mb-1 font-semibold text-gray-700">
                  {field.label}
                </label>
                <div className="relative">
                  <select
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    className="appearance-none w-full rounded-xl px-4 py-3 pr-10 bg-transparent
                               border border-gray-300 cursor-pointer transition"
                  >
                    <option value="">Pilih {field.label}</option>
                    {field.options.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}

            {/* Tombol Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full md:w-1/3 mx-auto mt-4 bg-amber-500 text-white
                         font-bold py-3 rounded-xl hover:bg-amber-400 transition"
            >
              Kirim via WhatsApp
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}
