"use client";

import React, { useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

function CreateKelebihanKekurangan() {
  const [judul, setJudul] = useState("");
  const [type, setType] = useState<"kelebihan" | "kekurangan">("kelebihan");
  const [details, setDetails] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleDetailChange(index: number, value: string) {
    const updated = [...details];
    updated[index] = value;
    setDetails(updated);
  }

  function addDetailField() {
    setDetails([...details, ""]);
  }

  function removeDetailField(index: number) {
    setDetails(details.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body = JSON.stringify({
      judul,
      type,
      details: details.filter((d) => d.trim() !== ""), // hanya kirim yang tidak kosong
    });

    setLoading(true);

    try {
      const res = await fetch("/api/backend/kelebihan-kekurangan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan data");
      }

      router.push("/backend/kelebihan-kekurangan");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Kelebihan / Kekurangan" />
      <ComponentCard title="Form Tambah Kelebihan / Kekurangan">
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Judul */}
          <div>
            <Label>Judul Utama</Label>
            <Input
              type="text"
              name="judul"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Masukkan judul (contoh: Mengapa Bless Architect ?)"
            />
          </div>

          {/* Tipe */}
          <div>
            <Label>Tipe</Label>
            <select
              name="type"
              value={type}
              onChange={(e) =>
                setType(e.target.value as "kelebihan" | "kekurangan")
              }
              className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="kelebihan">Kelebihan</option>
              <option value="kekurangan">Kekurangan</option>
            </select>
          </div>

          {/* Detail List */}
          <div>
            <Label>Daftar Detail</Label>
            <div className="space-y-2">
              {details.map((d, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={d}
                      required
                      onChange={(e) =>
                        handleDetailChange(index, e.target.value)
                      }
                      placeholder={`Detail ${index + 1}`}
                      className="w-full"
                    />
                  </div>
                  {details.length > 1 && (
                    <Button
                      type="button"
                      size="xs"
                      variant="danger"
                      onClick={() => removeDetailField(index)}
                    >
                      Hapus
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              size="xs"
              variant="primary"
              onClick={addDetailField}
              className="mt-2"
            >
              + Tambah Detail
            </Button>
          </div>

          {/* Action Buttons */}
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

export default withPermission(CreateKelebihanKekurangan, "add-kk");
