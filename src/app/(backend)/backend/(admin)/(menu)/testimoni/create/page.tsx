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
import { XCircle } from "lucide-react"; // Menggunakan XCircle untuk menghapus preview

// Tipe data untuk File yang di-preview
type PreviewFile = {
  file: File | null;
  url: string;
};

// Ganti nama komponen menjadi CreateTestimoni
function CreateTestimoni() {
  const [client, setClient] = useState("");
  const [message, setMessage] = useState("");
  const [alt, setAlt] = useState("");
  const [video, setVideo] = useState("");
  
  // State untuk file tunggal Avatar dan Src
  const [avatarFile, setAvatarFile] = useState<PreviewFile>({ file: null, url: "" });
  const [srcFile, setSrcFile] = useState<PreviewFile>({ file: null, url: "" });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Handler untuk file tunggal (misalnya Avatar)
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<PreviewFile>>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Bersihkan URL lama sebelum membuat yang baru
    setState((prev) => {
      if (prev.url) URL.revokeObjectURL(prev.url);
      return {
        file,
        url: URL.createObjectURL(file),
      };
    });

    event.target.value = ""; // Reset input
  };
  
  // Handler untuk menghapus preview file tunggal
  const handleRemoveFile = (setState: React.Dispatch<React.SetStateAction<PreviewFile>>) => {
    setState((prev) => {
      if (prev.url) URL.revokeObjectURL(prev.url);
      return { file: null, url: "" };
    });
  };

  // Cleanup: Batalkan URL objek saat komponen di-unmount
  useEffect(() => {
    return () => {
      if (avatarFile.url) URL.revokeObjectURL(avatarFile.url);
      if (srcFile.url) URL.revokeObjectURL(srcFile.url);
    };
  }, [avatarFile.url, srcFile.url]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validasi
    if (!client || !message || !avatarFile.file || !srcFile.file) {
      alert("Error: Nama Klien, Pesan, Avatar, dan Gambar Desain wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("client", client);
    formData.append("message", message);
    formData.append("alt", alt);
    formData.append("video", video);

    // Append File
    if (avatarFile.file) {
      formData.append("avatar", avatarFile.file, avatarFile.file.name);
    }
    if (srcFile.file) {
      formData.append("src", srcFile.file, srcFile.file.name);
    }

    setLoading(true);

    try {
      // PERUBAHAN ENDPOINT: Ganti ke endpoint Testimoni
      const res = await fetch("/api/backend/testimoni", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal membuat testimoni");
      }

      // Ganti rute redirect
      router.push("/backend/testimoni");
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }
  
  // Komponen Helper untuk Preview File Tunggal
  const SingleFilePreview = ({ fileData, onRemove, label }: { fileData: PreviewFile, onRemove: () => void, label: string }) => {
    if (!fileData.file) return null;
    
    return (
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="relative w-40 h-40 border border-gray-300 rounded-lg overflow-hidden group">
          <img src={fileData.url} alt={label} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XCircle size={20} />
          </button>
          <div className="absolute bottom-0 w-full p-1 bg-black/50 text-white text-xs text-center truncate">
            {fileData.file.name}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Testimoni" />
      <ComponentCard title="Form Tambah Testimoni">
        <form onSubmit={handleSubmit} className="grid gap-4">

          {/* NAMA KLIEN */}
          <div>
            <Label>Nama Klien <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              required
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Contoh: Budi Susanto"
            />
          </div>

          {/* PESAN TESTIMONI */}
          <div>
            <Label>Pesan Testimoni <span className="text-red-500">*</span></Label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan testimoni dari klien di sini..."
            />
          </div>
          
          {/* ALT (KETERANGAN DESAIN) */}
          <div>
            <Label>Keterangan Desain (Alt) </Label>
            <Input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Contoh: Desain Rumah 1, Desain Interior Bali"
            />
          </div>

          {/* URL VIDEO (OPSIONAL) */}
          <div>
            <Label>Link Video YouTube (Opsional)</Label>
            <Input
              type="url"
              value={video}
              onChange={(e) => setVideo(e.target.value)}
              placeholder="Contoh: https://www.youtube.com/embed/dQw4w9WgXcQ"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* UPLOAD AVATAR */}
            <div>
              <Label>Upload Avatar Klien <span className="text-red-500">*</span></Label>
              {avatarFile.file ? (
                <SingleFilePreview 
                  fileData={avatarFile} 
                  onRemove={() => handleRemoveFile(setAvatarFile)} 
                  label="Avatar Klien"
                />
              ) : (
                <FileInput
                  onChange={(e) => handleFileChange(e, setAvatarFile)}
                  accept=".png, .jpg, .jpeg, .webp"
                  // Hapus attribute multiple
                />
              )}
            </div>

            {/* UPLOAD GAMBAR DESAIN (SRC) */}
            <div>
              <Label>Upload Gambar Desain Terkait (SRC) <span className="text-red-500">*</span></Label>
              {srcFile.file ? (
                <SingleFilePreview 
                  fileData={srcFile} 
                  onRemove={() => handleRemoveFile(setSrcFile)} 
                  label="Gambar Desain"
                />
              ) : (
                <FileInput
                  onChange={(e) => handleFileChange(e, setSrcFile)}
                  accept=".png, .jpg, .jpeg, .webp"
                  // Hapus attribute multiple
                />
              )}
            </div>
          </div>
          
          {/* BUTTON */}
          <div className="flex justify-end mt-4">
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

// Ganti permission
export default withPermission(CreateTestimoni, "add-testimoni");