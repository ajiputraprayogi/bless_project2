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
import FileInput from "@/components/form/input/FileInput";

function EditPortofolio() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    document.title = "Edit Portofolio | Admin Panel";

    async function fetchPortofolio() {
      try {
        const res = await fetch(`/api/backend/portofolio/${params.id}`);
        if (!res.ok) throw new Error("Gagal memuat portofolio");

        const data = await res.json();
        setName(data.name || "");
        setDescription(data.description || "");
        setImagePreview(data.image || null);
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data portofolio");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchPortofolio();
  }, [params.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (imageFile) {
        formData.append("image", imageFile); // ⬅️ KEY SUDAH SAMA DENGAN BACKEND
      }

      const res = await fetch(`/api/backend/portofolio/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal update portofolio");

      router.push("/backend/portofolio");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update portofolio");
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Portofolio" />
        <ComponentCard title="Form Edit Portofolio">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Portofolio" />
      <ComponentCard title="Form Edit Portofolio">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Nama Portofolio</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Input Nama Portofolio"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Deskripsi</Label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-transparent dark:border-gray-600"
              rows={3}
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
  );
}

export default withPermission(EditPortofolio, "edit-portofolio");
