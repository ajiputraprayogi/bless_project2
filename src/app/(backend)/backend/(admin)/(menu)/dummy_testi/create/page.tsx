"use client";

import React, { useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

function CreateDummyTesti() {
  const [client, setClient] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!client || !message) {
      alert("Nama Klien dan Pesan wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/backend/dummy_testi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client,
          message,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan data");
      }

      router.push("/backend/dummy_testi");
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Dummy Testimoni" />

      <ComponentCard title="Form Tambah Dummy Testimoni">
        <form onSubmit={handleSubmit} className="grid gap-4">

          {/* NAMA KLIEN */}
          <div>
            <Label>
              Nama Klien <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              required
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Contoh: Budi Susanto"
            />
          </div>

          {/* PESAN */}
          <div>
            <Label>
              Pesan <span className="text-red-500">*</span>
            </Label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan di sini..."
            />
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

export default withPermission(CreateDummyTesti, "add-dummy-testi");
