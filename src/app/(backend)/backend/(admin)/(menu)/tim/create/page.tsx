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

function CreateTim() {
  const [nama, setNama] = useState("");
  const [posisi, setPosisi] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
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

  // cleanup saat unmount
  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("posisi", posisi);
    if (imageFile) formData.append("image", imageFile);

    setLoading(true);

    try {
      const res = await fetch("/api/backend/tim", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan anggota tim");
      }

      router.push("/backend/tim");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Anggota Tim" />
      <ComponentCard title="Form Tambah Anggota Tim">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Nama</Label>
            <Input
              type="text"
              name="nama"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama anggota tim"
            />
          </div>

          <div>
            <Label>Posisi</Label>
            <Input
              type="text"
              name="posisi"
              required
              value={posisi}
              onChange={(e) => setPosisi(e.target.value)}
              placeholder="Posisi dalam tim"
            />
          </div>

          <div>
            <Label>Foto</Label>
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

export default withPermission(CreateTim, "add-tim");
