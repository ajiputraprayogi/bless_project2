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

function EditChat() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    document.title = "Edit Chat | Admin Panel";

    async function fetchChat() {
      try {
        const res = await fetch(`/api/backend/chat/${params.id}`);
        if (!res.ok) throw new Error("Gagal memuat data chat");

        const data = await res.json();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setDiscount(data.discount ?? "");
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data chat");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchChat();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/backend/chat/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          discount: discount === "" ? null : Number(discount),
        }),
      });

      if (!res.ok) throw new Error("Gagal update data chat");

      router.push("/backend/chat");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update chat");
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Chat" />
        <ComponentCard title="Form Edit Chat">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Chat" />
      <ComponentCard title="Form Edit Chat">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Judul</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Input judul chat"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Deskripsi</Label>
            <textarea
              id="description"
              name="description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Input deskripsi chat"
              className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Diskon (%)</Label>
            <Input
              type="number"
              id="discount"
              name="discount"
              min="0"
              max="100"
              value={discount}
              onChange={(e) =>
                setDiscount(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Masukkan diskon (0-100)"
              disabled={loading}
            />
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

export default withPermission(EditChat, "edit-chat");
