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
import Select from "@/components/form/Select";
import { Trash2 } from "lucide-react";

// Tipe data untuk File yang di-preview
type PreviewFile = {
  file: File;
  url: string;
  id: number;
};

let fileIdCounter = 0;

function CreatePortofolio() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(""); // tipe baru (1,2,3)
  const [imageFiles, setImageFiles] = useState<PreviewFile[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Upload Multiple Images
  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles: PreviewFile[] = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: fileIdCounter++,
    }));

    setImageFiles((prev) => [...prev, ...newFiles]);
    event.target.value = "";
  };

  const handleRemoveFile = (id: number) => {
    setImageFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  useEffect(() => {
    return () => {
      imageFiles.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [imageFiles]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !type) {
      alert("Error: Nama & Tipe wajib diisi.");
      return;
    }

    if (imageFiles.length === 0) {
      alert("Error: Minimal unggah satu gambar.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", type);

    imageFiles.forEach((pf) => {
      formData.append("images", pf.file, pf.file.name);
    });

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

          {/* NAMA */}
          <div>
            <Label>Nama Portofolio <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama portofolio"
            />
          </div>

          {/* DESKRIPSI */}
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

          {/* TIPE BARU */}
          <div>
            <Label>Tipe <span className="text-red-500">*</span></Label>
            <Select
              value={type}
              onChange={(val: string | number) => setType(String(val))}
              placeholder="Pilih Tipe"
              options={[
                { label: "Arsitek", value: "arsitek" },
                { label: "Kontraktor", value: "kontraktor" },
                { label: "Interior & Furtinur", value: "furnitur" },
                { label: "Animasi", value: "animasi" },
                { label: "Komersial", value: "komersial" },
              ]}
            />
          </div>

          {/* UPLOAD GAMBAR */}
          <div>
            <Label>Upload Gambar (Multiple) <span className="text-red-500">*</span></Label>
            <FileInput
              onChange={handleFilesChange}
              accept=".png, .jpg, .jpeg, .webp"
              multiple
            />

            {/* PREVIEW GAMBAR */}
            {imageFiles.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {imageFiles.map((pf) => (
                  <div key={pf.id} className="relative w-40 h-40 border border-gray-300 rounded-lg overflow-hidden group">
                    <img src={pf.url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(pf.id)}
                      className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="absolute bottom-0 w-full p-1 bg-black/50 text-white text-xs text-center truncate">
                      {pf.file.name}
                    </div>
                  </div>
                ))}
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

export default withPermission(CreatePortofolio, "add-portofolio");
