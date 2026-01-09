"use client";

import React, { useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Swal from "sweetalert2";

function CreateLinkAnimasi() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!link) {
      Swal.fire("Validasi", "Link animasi wajib diisi", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/backend/link_animasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan data");
      }

      Swal.fire("Berhasil", "Link animasi berhasil ditambahkan", "success");
      router.push("/backend/link_animasi");
    } catch (error) {
      Swal.fire(
        "Error",
        (error as Error).message || "Terjadi kesalahan",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Link Animasi" />

      <ComponentCard title="Form Tambah Link Animasi">
        <form onSubmit={handleSubmit} className="grid gap-4">

          {/* LINK ANIMASI */}
          <div>
            <Label>
              Link Animasi <span className="text-red-500">*</span>
            </Label>
            <Input
              type="url"
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://youtu.be/xxxxx"
              disabled={loading}
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

export default withPermission(CreateLinkAnimasi, "add-link-animasi");
