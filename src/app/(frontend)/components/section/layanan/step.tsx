"use client";
import { FaCheckCircle } from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "Konsultasi Awal",
    side: "start",
    description: [
      "Diskusi kebutuhan, gaya desain, luas bangunan, fungsi ruang, dan anggaran.",
      "Pengumpulan data lahan (survey lokasi, ukuran, kondisi, dll).",
    ],
  },
  {
    id: 2,
    title: "Konsep Desain",
    side: "end",
    description: [
      "Pembuatan mood board atau referensi desain sesuai keinginan klien.",
      "Penyusunan konsep denah awal & zoning ruang.",
    ],
  },
  {
    id: 3,
    title: "Desain Skematik (Preliminary Design)",
    side: "start",
    description: [
      "Pembuatan denah kasar, tampak, dan sketsa 3D sederhana.",
      "Revisi bersama klien hingga sesuai dengan visi & kebutuhan.",
    ],
  },
  {
    id: 4,
    title: "Desain Pengembangan (Design Development)",
    side: "end",
    description: [
      "Penyusunan gambar denah detail, tampak bangunan, potongan, dan 3D visual yang lebih realistis.",
      "Penentuan material utama & gaya arsitektur (minimalis, modern, klasik, luxury, dll).",
    ],
  },
  {
    id: 5,
    title: "Gambar Kerja (Detail Engineering Drawing)",
    side: "start",
    description: [
      "Pembuatan gambar teknis lengkap (arsitektur, struktur, elektrikal, plumbing, dll).",
      "Dokumen ini menjadi acuan pembangunan di lapangan.",
    ],
  },
  {
    id: 6,
    title: "3D Visualisasi & Rendering",
    side: "end",
    description: [
      "Penyajian visualisasi 3D interior & eksterior dengan kualitas realistis.",
      "Memberikan gambaran nyata hasil akhir bangunan.",
    ],
  },
  {
    id: 7,
    title: "Rencana Anggaran Biaya (RAB)",
    side: "start",
    description: [
      "Penyusunan estimasi biaya pembangunan yang rinci dan efisien.",
      "Menjadi panduan budgeting klien dalam pelaksanaan.",
    ],
  },
  {
    id: 8,
    title: "Finalisasi & Serah Dokumen Desain",
    side: "end",
    description: [
      "Penyerahan paket lengkap: gambar kerja, 3D visual, dan RAB.",
      "Klien siap masuk ke tahap pembangunan.",
    ],
  },
];

export default function StepSection() {
  return (
    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
      {steps.map((step, index) => (
        <li key={step.id} data-aos="fade-up">
          {index !== 0 && <hr />}
          <div className="timeline-middle m-4"><FaCheckCircle /></div>
          <div
            className={`timeline-${step.side} mb-10 ${
              step.side === "start" ? "md:text-end" : ""
            }`}
          >
            {/* <time className="font-mono italic"></time> */}
            <div className="text-xl font-black text-[#2E2B25]">{step.title}</div>
            {step.description.map((desc, i) => (
              <p key={i}>{desc}</p>
            ))}
          </div>
          <hr />
        </li>
      ))}
    </ul>
  );
}