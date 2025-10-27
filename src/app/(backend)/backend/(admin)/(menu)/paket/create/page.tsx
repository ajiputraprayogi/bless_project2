"use client";

import React, { useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

function CreatePaket() {
  const [name, setName] = useState("");
  const [harga, setHarga] = useState("");
  const [fitur, setFitur] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleFiturChange(index: number, value: string) {
    const updated = [...fitur];
    updated[index] = value;
    setFitur(updated);
  }

  function addFiturField() {
    setFitur([...fitur, ""]);
  }

  function removeFiturField(index: number) {
    setFitur(fitur.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body = JSON.stringify({
      name,
      harga,
      fitur: fitur.filter((f) => f.trim() !== ""), // hapus fitur kosong
    });

    setLoading(true);

    try {
      const res = await fetch("/api/backend/paket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan Paket");
      }

      router.push("/backend/paket");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Paket" />
      <ComponentCard title="Form Tambah Paket">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Nama Paket</Label>
            <Input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama paket"
            />
          </div>

          <div>
            <Label>Harga</Label>
            <Input
              type="text"
              name="harga"
              required
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              placeholder="Masukkan harga (misal: 25.000 /M²)"
            />
          </div>

          <div>
            <Label>Fitur</Label>
            {fitur.map((f, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={f}
                    required
                    onChange={(e) => handleFiturChange(index, e.target.value)}
                    placeholder={`Fitur ${index + 1}`}
                    className="w-full" // pastikan override internal InputField
                  />
                </div>
                {fitur.length > 1 && (
                  <Button
                    type="button"
                    size="xs"
                    variant="danger"
                    onClick={() => removeFiturField(index)}
                  >
                    Hapus
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" size="xs" variant="primary" onClick={addFiturField}>
              Tambah Fitur
            </Button>
          </div>

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

export default withPermission(CreatePaket, "add-paket");
