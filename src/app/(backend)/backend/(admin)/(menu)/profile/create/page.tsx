"use client";

import React, { useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

function CreateProfile() {
  const [sejarah, setSejarah] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState<string[]>([""]); // array of misi
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    const body = JSON.stringify({
      sejarah,
      visi,
      misi: misi.filter((text) => text.trim() !== ""), // buang yang kosong
    });

    setLoading(true);

    try {
      const res = await fetch("/api/backend/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan Profile");
      }

      router.push("/backend/profile");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Profile" />
      <ComponentCard title="Form Tambah Profile">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Sejarah</Label>
            <textarea
              name="sejarah"
              required
              value={sejarah}
              onChange={(e) => setSejarah(e.target.value)}
              placeholder="Masukkan sejarah organisasi/perusahaan"
              className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <Label>Visi</Label>
            <Input
              type="text"
              name="visi"
              required
              value={visi}
              onChange={(e) => setVisi(e.target.value)}
              placeholder="Masukkan visi organisasi/perusahaan"
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
                    required
                    onChange={(e) => handleChangeMisi(index, e.target.value)}
                    placeholder={`Misi ${index + 1}`}
                    className="w-full" // supaya full width seperti sejarah & visi
                  />
                </div>
                {misi.length > 1 && (
                  <Button
                    type="button"
                    size="xs"
                    variant="danger"
                    onClick={() => handleRemoveMisi(index)}
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
            >
              + Tambah Misi
            </Button>
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

export default withPermission(CreateProfile, "add-profile");
