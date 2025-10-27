"use client";

import React, { useEffect, useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import SkeletonDefault from "@/components/skeleton/Default";
import Switch from "@/components/form/switch/Switch";
import Select from "@/components/form/Select";
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

function EditContact() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState<string>("whatsapp");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    document.title = "Edit Kontak | Admin Panel";

    async function fetchContact() {
      try {
        const res = await fetch(`/api/backend/kontak/${params.id}`);
        if (!res.ok) throw new Error("Gagal memuat data kontak");

        const data = await res.json();

        setPlatform(data.platform || "");
        setUrl(data.url || "");
        setIcon(data.icon || "whatsapp");
        setIsActive(Boolean(data.is_active));
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data kontak");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchContact();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/backend/kontak/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          url,
          icon,
          is_active: isActive,
        }),
      });

      if (!res.ok) throw new Error("Gagal update kontak");

      router.push("/backend/kontak");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update kontak");
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Kontak" />
        <ComponentCard title="Form Edit Kontak">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Kontak" />
      <div className="space-y-6">
        <ComponentCard title="Form Edit Kontak">
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-gray-600">Preview:</span>
                {iconPreview[icon]}
              </div>
            </div>

            {/* Switch Aktif */}
            <div className="flex items-center space-x-2">
              <Label>Aktif</Label>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={loading}
              />
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
                disabled={loading}
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

export default withPermission(EditContact, "edit-kontak");
