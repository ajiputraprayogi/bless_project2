"use client";

import React, { useState, useEffect, useRef } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";

function CreateKeunggulan() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewRef = useRef<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      setImageFile(file);

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

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title) {
      alert("Judul Keunggulan wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    setLoading(true);

    try {
      const res = await fetch("/api/backend/keunggulan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal membuat keunggulan");
      }

      router.push("/backend/keunggulan");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Keunggulan" />
      <ComponentCard title="Form Tambah Keunggulan">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Judul Keunggulan</Label>
            <Input
              type="text"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul keunggulan"
            />
          </div>

          <div>
            <Label>Deskripsi</Label>
            <TextArea
              value={description}
              onChange={(val) => setDescription(val)} // ❌ langsung val, bukan e.target.value
              placeholder="Deskripsi keunggulan"
              rows={4}
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

export default withPermission(CreateKeunggulan, "add-keunggulan");
