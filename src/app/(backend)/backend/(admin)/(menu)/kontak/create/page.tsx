"use client";

import React, { useState, useEffect } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import SkeletonDefault from "@/components/skeleton/Default";
import Switch from "@/components/form/switch/Switch";
import Select from "@/components/form/Select"; // ✅ pakai komponen Select
import {
  FaWhatsapp,
  FaTiktok,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

const iconOptions = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "tiktok", label: "TikTok" },
  { value: "x", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "mail", label: "Email" },
];

const iconPreview: Record<string, React.ReactNode> = {
  whatsapp: <FaWhatsapp className="inline text-green-600 text-xl" />,
  tiktok: <FaTiktok className="inline text-black text-xl" />,
  x: <FaTwitter className="inline text-black text-xl" />,
  instagram: <FaInstagram className="inline text-pink-500 text-xl" />,
  facebook: <FaFacebook className="inline text-blue-600 text-xl" />,
  linkedin: <FaLinkedin className="inline text-blue-500 text-xl" />,
  mail: <FaEnvelope className="inline text-red-500 text-xl" />,
};

function CreateContact() {
  useEffect(() => {
    document.title = "Tambah Kontak | Admin Panel";
  }, []);

  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState<string>("whatsapp"); // default whatsapp
  const [isActive, setIsActive] = useState(true);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setInitialLoading(false);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/backend/kontak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        url,
        icon,
        is_active: isActive,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/backend/kontak");
    } else {
      alert("Gagal menambahkan kontak");
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Kontak" />
        <ComponentCard title="Form Tambah Kontak">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Kontak" />
      <div className="space-y-6">
        <ComponentCard title="Form Tambah Kontak">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            {/* Platform */}
            <div>
              <Label>Platform</Label>
              <Input
                type="text"
                id="platform"
                name="platform"
                required
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                placeholder="Contoh: Instagram, Facebook, WhatsApp"
              />
            </div>

            {/* URL */}
            <div>
              <Label>Link URL</Label>
              <Input
                type="url"
                id="url"
                name="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            {/* Icon */}
            <div>
              <Label>Pilih Icon</Label>
              <Select
                options={iconOptions}
                value={icon}
                onChange={(val) => setIcon(String(val))}
                placeholder="Pilih ikon"
              />
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Preview:</span>
                {iconPreview[icon]}
              </div>
            </div>

            {/* Switch Aktif */}
            <div className="flex items-center space-x-2">
              <Label>Aktif</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>

            {/* Tombol */}
            <div className="flex justify-end">
              <Button
                size="sm"
                className="mr-2"
                variant="danger"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  router.back();
                }}
              >
                Kembali
              </Button>

              <Button size="sm" variant="green" type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}

export default withPermission(CreateContact, "add-kontak");
