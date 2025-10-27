"use client";

import React, { useState, useEffect, useRef } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";

function CreatePortofolio() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null); // ✅ simpan URL di ref agar bisa dibersihkan dengan aman
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      setImageFile(file);

      // bersihkan URL lama
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);

      const url = URL.createObjectURL(file);
      previewRef.current = url;
      setPreviewUrl(url);
    } else {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
      setImageFile(null);
      setPreviewUrl(null);
    }
  };

  // ✅ cleanup hanya saat unmount
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // browser akan validasi otomatis karena pakai `required` di input
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    setLoading(true);

    try {
      const res = await fetch("/api/backend/portofolio", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal membuat portofolio");
      }

      router.push("/backend/portofolio");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Portofolio" />
      <ComponentCard title="Form Tambah Portofolio">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Nama Portofolio</Label>
            <Input
              type="text"
              name="name"
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama portofolio"
            />
          </div>

          <div>
            <Label>Deskripsi</Label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi portofolio"
            />
          </div>

          <div>
            <Label>Upload Gambar</Label>
            <FileInput onChange={handleFileChange} className="custom-class" />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 max-h-48 rounded border border-gray-300 object-cover"
              />
            )}
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              variant="danger"
              type="button"
              onClick={() => router.back()}
              className="mr-2"
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
  );
}

export default withPermission(CreatePortofolio, "add-portofolio");
