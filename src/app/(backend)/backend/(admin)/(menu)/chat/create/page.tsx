"use client";

import React, { useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

function CreateChat() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body = JSON.stringify({
      title,
      description,
      discount: discount === "" ? null : Number(discount),
    });

    setLoading(true);

    try {
      const res = await fetch("/api/backend/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan chat");
      }

      router.push("/backend/chat");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Chat" />
      <ComponentCard title="Form Tambah Chat">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Judul</Label>
            <Input
              type="text"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul Chat"
            />
          </div>

          <div>
            <Label>Deskripsi</Label>
            <textarea
              name="description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Isi deskripsi chat"
              className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <Label>Diskon (%)</Label>
            <Input
              type="number"
              name="discount"
              min="0"
              max="100"
              value={discount}
              onChange={(e) =>
                setDiscount(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Masukkan angka diskon (0-100)"
            />
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

export default withPermission(CreateChat, "add-chat");
