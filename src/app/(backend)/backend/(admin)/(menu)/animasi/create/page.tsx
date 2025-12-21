"use client";

import React, { useState, useEffect } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import { Trash2 } from "lucide-react";

/* ===============================
   TYPE THUMBNAIL PREVIEW
================================ */
type PreviewFile = {
  file: File;
  url: string;
};

function CreatePortofolioVideo() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [thumbnail, setThumbnail] = useState<PreviewFile | null>(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     HANDLE THUMBNAIL
  ================================ */
  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (thumbnail) URL.revokeObjectURL(thumbnail.url);

    setThumbnail({
      file,
      url: URL.createObjectURL(file),
    });

    e.target.value = "";
  };

  const removeThumbnail = () => {
    if (thumbnail) URL.revokeObjectURL(thumbnail.url);
    setThumbnail(null);
  };

  useEffect(() => {
    return () => {
      if (thumbnail) URL.revokeObjectURL(thumbnail.url);
    };
  }, [thumbnail]);

  /* ===============================
     SUBMIT
  ================================ */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !link) {
      alert("Judul dan link video wajib diisi.");
      return;
    }

    if (!thumbnail) {
      alert("Thumbnail wajib diunggah.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("link", link);
    formData.append("thumbnail", thumbnail.file);

    setLoading(true);

    try {
      const res = await fetch("/api/backend/animasi", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan portofolio video");
      }

      router.push("/backend/animasi");
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     RENDER
  ================================ */
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Portofolio Video" />

      <ComponentCard title="Form Tambah Portofolio Video">
        <form onSubmit={handleSubmit} className="grid gap-4">

          {/* JUDUL */}
          <div>
            <Label>
              Judul Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul video"
            />
          </div>

          {/* LINK */}
          <div>
            <Label>
              Link Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="url"
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=xxxx"
            />
          </div>

          {/* THUMBNAIL */}
          <div>
            <Label>
              Thumbnail <span className="text-red-500">*</span>
            </Label>
            <FileInput
              onChange={handleThumbnailChange}
              accept=".png,.jpg,.jpeg,.webp"
            />

            {thumbnail && (
              <div className="mt-4 relative w-48 h-32 border rounded-lg overflow-hidden group">
                <img
                  src={thumbnail.url}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* BUTTON */}
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

export default withPermission(
  CreatePortofolioVideo,
  "add-portofolio-video"
);
