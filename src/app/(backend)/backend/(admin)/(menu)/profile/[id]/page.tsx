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

function EditProfile() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [sejarah, setSejarah] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    document.title = "Edit Profile | Admin Panel";

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/backend/profile/${params.id}`);
        if (!res.ok) throw new Error("Gagal memuat data Profile");

        const data = await res.json();
        setSejarah(data.sejarah || "");
        setVisi(data.visi || "");
        setMisi(data.misi?.map((m: any) => m.text) || []);
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data Profile");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchProfile();
  }, [params.id]);

  function handleAddMisi() {
    setMisi([...misi, ""]);
  }

  function handleRemoveMisi(index: number) {
    setMisi(misi.filter((_, i) => i !== index));
  }

  function handleChangeMisi(index: number, value: string) {
    const newMisi = [...misi];
    newMisi[index] = value;
    setMisi(newMisi);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/backend/profile/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sejarah,
          visi,
          misi: misi.filter((text) => text.trim() !== ""), // kirim array misi
        }),
      });

      if (!res.ok) throw new Error("Gagal update data Profile");

      router.push("/backend/profile");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update Profile");
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Profile" />
        <ComponentCard title="Form Edit Profile">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Profile" />
      <ComponentCard title="Form Edit Profile">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Sejarah</Label>
            <textarea
              id="sejarah"
              name="sejarah"
              value={sejarah}
              required
              onChange={(e) => setSejarah(e.target.value)}
              placeholder="Masukkan sejarah organisasi/perusahaan"
              className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Visi</Label>
            <Input
              type="text"
              id="visi"
              name="visi"
              value={visi}
              required
              onChange={(e) => setVisi(e.target.value)}
              placeholder="Masukkan visi organisasi/perusahaan"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Misi</Label>
            {misi.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={item}
                    onChange={(e) => handleChangeMisi(index, e.target.value)}
                    placeholder={`Misi ${index + 1}`}
                    required
                    disabled={loading}
                    className="w-full" // supaya sama lebar dengan input sejarah & visi
                  />
                </div>
                {misi.length > 1 && (
                  <Button
                    type="button"
                    size="xs"
                    variant="danger"
                    onClick={() => handleRemoveMisi(index)}
                    disabled={loading}
                  >
                    Hapus
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              size="xs"
              variant="primary"
              onClick={handleAddMisi}
              disabled={loading}
            >
              + Tambah Misi
            </Button>
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

export default withPermission(EditProfile, "edit-profile");
