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
import Swal from "sweetalert2";

function EditLinkAnimasi() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;

  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ================================
  // FETCH DATA link_animasi
  // ================================
  useEffect(() => {
    document.title = "Edit Link Animasi | Admin Panel";

    async function fetchData() {
      if (!id) return;

      try {
        const res = await fetch(`/api/backend/link_animasi/${id}`);
        if (!res.ok) throw new Error("Gagal memuat data");

        const data = await res.json();
        setLink(data.link || "");
      } catch (error) {
        Swal.fire("Error", "Gagal memuat data link animasi", "error");
        router.push("/backend/link_animasi");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchData();
  }, [id, router]);

  // ================================
  // SUBMIT
  // ================================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!link) {
      Swal.fire("Validasi", "Link animasi wajib diisi", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/backend/link_animasi/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal update data");
      }

      Swal.fire("Berhasil", "Link animasi berhasil diperbarui", "success");
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

  // ================================
  // LOADING
  // ================================
  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Link Animasi" />
        <ComponentCard title="Form Edit Link Animasi">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  // ================================
  // RENDER
  // ================================
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Link Animasi" />

      <ComponentCard title="Form Edit Link Animasi">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* LINK ANIMASI */}
          <div>
            <Label>
              Link Animasi <span className="text-red-500">*</span>
            </Label>
            <Input
              type="url"
              placeholder="https://example.com/animasi"
              value={link}
              onChange={(e) => setLink(e.target.value)}
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

            <Button
              size="sm"
              variant="green"
              type="submit"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>

        </form>
      </ComponentCard>
    </div>
  );
}

export default withPermission(EditLinkAnimasi, "edit-link-animasi");
