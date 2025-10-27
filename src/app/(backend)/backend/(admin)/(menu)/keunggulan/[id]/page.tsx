"use client";

import React, { useEffect, useState, useRef } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import SkeletonDefault from "@/components/skeleton/Default";

function EditKeunggulan() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    document.title = "Edit Keunggulan | Admin Panel";

    async function fetchKeunggulan() {
      try {
        const res = await fetch(`/api/backend/keunggulan/${params.id}`);
        if (!res.ok) throw new Error("Gagal memuat keunggulan");

        const data = await res.json();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setImagePreview(data.image || null);
        previewRef.current = data.image || null;
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data keunggulan");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchKeunggulan();
  }, [params.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);

    if (previewRef.current) URL.revokeObjectURL(previewRef.current);

    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      previewRef.current = url;
    } else {
      setImagePreview(null);
      previewRef.current = null;
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
      alert("Judul wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`/api/backend/keunggulan/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal update keunggulan");
      }

      router.push("/backend/keunggulan");
    } catch (error) {
      console.error(error);
      alert((error as Error).message || "Terjadi kesalahan saat update keunggulan");
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Keunggulan" />
        <ComponentCard title="Form Edit Keunggulan">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Keunggulan" />
      <ComponentCard title="Form Edit Keunggulan">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">

          <div>
            <Label>Judul Keunggulan</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Input Judul Keunggulan"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Deskripsi</Label>
            <TextArea
              value={description}
              onChange={(val) => setDescription(val)} // ❌ langsung val dari TextArea custom
              rows={4}
              placeholder="Deskripsi keunggulan"
              className="dark:bg-gray-900 dark:text-white/90"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Gambar</Label>
            <FileInput onChange={handleFileChange} disabled={loading} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-32 rounded-md object-cover"
              />
            )}
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              className="mr-2"
              variant="danger"
              type="button"
              onClick={() => router.back()}
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

export default withPermission(EditKeunggulan, "edit-keunggulan");
