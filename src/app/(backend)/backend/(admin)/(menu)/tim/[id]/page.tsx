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

function EditTim() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [nama, setNama] = useState("");
  const [posisi, setPosisi] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    document.title = "Edit Anggota Tim | Admin Panel";

    async function fetchTim() {
      try {
        const res = await fetch(`/api/backend/tim/${params.id}`);
        if (!res.ok) throw new Error("Gagal memuat data tim");

        const data = await res.json();
        setNama(data.nama || "");
        setPosisi(data.posisi || "");
        setImagePreview(data.image || null);
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data tim");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchTim();
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
      formData.append("nama", nama);
      formData.append("posisi", posisi);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`/api/backend/tim/${params.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal update data tim");

      router.push("/backend/tim");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update anggota tim");
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Tim" />
        <ComponentCard title="Form Edit Anggota Tim">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Tim" />
      <ComponentCard title="Form Edit Anggota Tim">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Nama</Label>
            <Input
              type="text"
              id="nama"
              name="nama"
              value={nama}
              required
              onChange={(e) => setNama(e.target.value)}
              placeholder="Input nama anggota tim"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Posisi</Label>
            <Input
              type="text"
              id="posisi"
              name="posisi"
              value={posisi}
              required
              onChange={(e) => setPosisi(e.target.value)}
              placeholder="Input posisi anggota tim"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Foto</Label>
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

export default withPermission(EditTim, "edit-tim");
