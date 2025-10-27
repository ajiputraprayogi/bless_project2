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

function EditKelebihanKekurangan() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [judul, setJudul] = useState("");
  const [type, setType] = useState<"kelebihan" | "kekurangan">("kelebihan");
  const [details, setDetails] = useState<string[]>([""]);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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

  useEffect(() => {
    document.title = "Edit Kelebihan & Kekurangan | Admin Panel";

    async function fetchData() {
      try {
        const res = await fetch(`/api/backend/kelebihan-kekurangan/${params.id}`);
        if (!res.ok) throw new Error("Gagal memuat data");

        const data = await res.json();

        setJudul(data.judul || "");
        setType(data.type || "kelebihan");

        // ✅ ambil dari relasi detail
        setDetails(
          data.kelebihan_kekurangan_detail && data.kelebihan_kekurangan_detail.length > 0
            ? data.kelebihan_kekurangan_detail.map((d: any) => d.detail)
            : [""]
        );
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/backend/kelebihan-kekurangan/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          type,
          detail: details.filter((d) => d.trim() !== ""), // ✅ sesuaikan dengan API (detail array)
        }),
      });

      if (!res.ok) throw new Error("Gagal update data");

      router.push("/backend/kelebihan-kekurangan");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update data");
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Kelebihan & Kekurangan" />
        <ComponentCard title="Form Edit Kelebihan & Kekurangan">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Kelebihan & Kekurangan" />
      <ComponentCard title="Form Edit Kelebihan & Kekurangan">
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Judul */}
          <div>
            <Label>Judul</Label>
            <Input
              type="text"
              name="judul"
              value={judul}
              required
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Masukkan judul utama"
              disabled={loading}
            />
          </div>

          {/* Tipe */}
          <div>
            <Label>Tipe</Label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as "kelebihan" | "kekurangan")}
              disabled={loading}
              className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="kelebihan">Kelebihan</option>
              <option value="kekurangan">Kekurangan</option>
            </select>
          </div>

          {/* Detail List */}
          <div>
            <Label>Detail</Label>
            {details.map((d, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    value={d}
                    required
                    onChange={(e) => handleDetailChange(index, e.target.value)}
                    placeholder={`Detail ${index + 1}`}
                    className="w-full"
                    disabled={loading}
                  />
                </div>
                {details.length > 1 && (
                  <Button
                    type="button"
                    size="xs"
                    variant="danger"
                    onClick={() => removeDetailField(index)}
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
              onClick={addDetailField}
              disabled={loading}
            >
              Tambah Detail
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              variant="danger"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
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

export default withPermission(EditKelebihanKekurangan, "edit-kk");
