"use client";

import React, { useState, useEffect } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import { Trash2 } from "lucide-react";

/* ===============================
   TYPE
================================ */
type OldThumbnail = {
  url: string;
};

type PreviewFile = {
  file: File;
  url: string;
};

function EditPortofolioVideo() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [oldThumbnail, setOldThumbnail] = useState<OldThumbnail | null>(null);
  const [newThumbnail, setNewThumbnail] = useState<PreviewFile | null>(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     LOAD DATA
  ================================ */
  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const res = await fetch(`/api/backend/animasi/${id}`);
        if (!res.ok) throw new Error("Gagal memuat data video");

        const data = await res.json();

        setTitle(data.title || "");
        setLink(data.link || "");

        if (data.thumbnail) {
          setOldThumbnail({ url: data.thumbnail });
        }
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data portofolio video.");
      }
    }

    loadData();
  }, [id]);

  /* ===============================
     CLEANUP
  ================================ */
  useEffect(() => {
    return () => {
      if (newThumbnail) URL.revokeObjectURL(newThumbnail.url);
    };
  }, [newThumbnail]);

  /* ===============================
     HANDLERS
  ================================ */
  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (newThumbnail) URL.revokeObjectURL(newThumbnail.url);

    setNewThumbnail({
      file,
      url: URL.createObjectURL(file),
    });

    e.target.value = "";
  };

  const removeOldThumbnail = () => {
    setOldThumbnail(null);
  };

  const removeNewThumbnail = () => {
    if (newThumbnail) URL.revokeObjectURL(newThumbnail.url);
    setNewThumbnail(null);
  };

  /* ===============================
     SUBMIT
  ================================ */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !link) {
      alert("Judul dan link wajib diisi.");
      return;
    }

    if (!oldThumbnail && !newThumbnail) {
      alert("Thumbnail wajib ada.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("link", link);

    if (!oldThumbnail) {
      formData.append("remove_thumbnail", "true");
    }

    if (newThumbnail) {
      formData.append("thumbnail", newThumbnail.file);
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/backend/animasi/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal update portofolio video");
      }

      router.push("/backend/animasi");
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     RENDER
  ================================ */
  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Portofolio Video" />

      <ComponentCard title="Edit Portofolio Video">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* TITLE */}
          <div>
            <Label>
              Judul Video <span className="text-red-500">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* LINK */}
          <div>
            <Label>
              Link Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
          </div>

          {/* OLD THUMBNAIL */}
          <div>
            <Label>Thumbnail Saat Ini</Label>

            {oldThumbnail ? (
              <div className="relative w-48 h-32 border rounded overflow-hidden group">
                <img
                  src={oldThumbnail.url}
                  className="w-full h-full object-cover"
                  alt="Thumbnail lama"
                />
                <button
                  type="button"
                  onClick={removeOldThumbnail}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <p className="text-gray-500">Thumbnail dihapus</p>
            )}
          </div>

          {/* NEW THUMBNAIL */}
          <div>
            <Label>Ganti Thumbnail</Label>
            <FileInput
              onChange={handleThumbnailChange}
              accept=".png,.jpg,.jpeg,.webp"
            />

            {newThumbnail && (
              <div className="mt-3 relative w-48 h-32 border rounded overflow-hidden group">
                <img
                  src={newThumbnail.url}
                  className="w-full h-full object-cover"
                  alt="Thumbnail baru"
                />
                <button
                  type="button"
                  onClick={removeNewThumbnail}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* BUTTON */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="danger"
              className="mr-2"
              onClick={() => router.back()}
            >
              Kembali
            </Button>

            <Button type="submit" variant="green" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

export default withPermission(
  EditPortofolioVideo,
  "edit-portofolio-video"
);
