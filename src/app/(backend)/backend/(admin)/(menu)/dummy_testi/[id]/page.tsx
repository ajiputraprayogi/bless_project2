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

function EditDummyTesti() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;

  const [client, setClient] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch data dummy_testi
  useEffect(() => {
    document.title = "Edit Dummy Testimoni | Admin Panel";

    async function fetchData() {
      if (!id) return;

      try {
        const res = await fetch(`/api/backend/dummy_testi/${id}`);
        if (!res.ok) throw new Error("Gagal memuat data");

        const data = await res.json();
        setClient(data.client || "");
        setMessage(data.message || "");
      } catch (error) {
        alert("Gagal memuat data dummy testimoni");
        router.push("/backend/dummy_testi");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!client || !message) {
      alert("Nama Klien dan Pesan wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/backend/dummy_testi/${id}`, {
        method: "PATCH",
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
        throw new Error(err.error || "Gagal update data");
      }

      router.push("/backend/dummy_testi");
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Dummy Testimoni" />
        <ComponentCard title="Form Edit Dummy Testimoni">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Dummy Testimoni" />

      <ComponentCard title="Form Edit Dummy Testimoni">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAMA KLIEN */}
          <div>
            <Label>
              Nama Klien <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              required
              disabled={loading}
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* BUTTON */}
          <div className="flex justify-end pt-4">
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
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>

        </form>
      </ComponentCard>
    </div>
  );
}

export default withPermission(EditDummyTesti, "edit-dummy-testi");
