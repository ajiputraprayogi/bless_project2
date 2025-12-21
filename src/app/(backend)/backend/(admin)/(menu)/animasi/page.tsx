"use client";

import React, { useEffect, useState, useMemo } from "react";
import { hasPermission } from "@/utils/hasPermission";
import { usePermissions } from "@/context/PermissionsContext";
import withPermission from "@/components/auth/withPermission";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import SkeletonTable from "@/components/skeleton/Table";
import AddPortofolioVideoButton from "./AddPortofolioVideoButton";
import Button from "@/components/ui/button/Button";

/* ===============================
   TYPE DATA (PORTOFOLIO VIDEO)
================================ */
type PortofolioVideo = {
  id: number;
  title: string;
  thumbnail_url: string | null;
  video_url: string;
  description?: string | null;
  type?: string | null;
};

function PortofolioVideoPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } =
    usePermissions();

  const [videos, setVideos] = useState<PortofolioVideo[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     PERMISSIONS
  ================================ */
  const canAdd = useMemo(
    () => hasPermission(userPermissions, "add-portofolio-video"),
    [userPermissions]
  );
  const canEdit = useMemo(
    () => hasPermission(userPermissions, "edit-portofolio-video"),
    [userPermissions]
  );
  const canDelete = useMemo(
    () => hasPermission(userPermissions, "delete-portofolio-video"),
    [userPermissions]
  );

  const typeLabels: Record<string, string> = {
    youtube: "YouTube",
    reels: "Instagram Reels",
    tiktok: "TikTok",
    cinematic: "Cinematic",
  };

  /* ===============================
     FETCH DATA
  ================================ */
  useEffect(() => {
    document.title = "Data Portofolio Video | Admin Panel";
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/animasi", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Gagal memuat data portofolio video");

      const data = await res.json();
      setVideos(data);
    } catch (err: unknown) {
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "Terjadi kesalahan",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  /* ===============================
     ACTIONS
  ================================ */
  function handleEdit(id: number) {
    router.push(`/backend/animasi/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus video ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/animasi/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus video");

      setVideos((prev) => prev.filter((v) => v.id !== id));
      Swal.fire("Terhapus!", "Portofolio video berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "Terjadi kesalahan",
        "error"
      );
    }
  }

  /* ===============================
     LOADING
  ================================ */
  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Portofolio Video" />
        <ComponentCard title="Data Portofolio Video Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  /* ===============================
     RENDER
  ================================ */
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Portofolio Video" />

      <ComponentCard
        title="Data Portofolio Video Table"
        headerRight={canAdd && <AddPortofolioVideoButton />}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 text-start">
                      Video
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start">
                      Type
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {videos.map((video) => {
                    const description = video.description ?? "";
                    const shortDescription =
                      description.length > 150
                        ? description.slice(0, 150) + "..."
                        : description || "Tidak ada deskripsi";

                    return (
                      <TableRow key={video.id}>
                        {/* VIDEO */}
                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex items-center gap-3">
                            {video.thumbnail_url ? (
                              <img
                                src={video.thumbnail_url}
                                alt={video.title}
                                className="h-32 w-32 rounded-lg object-cover border"
                              />
                            ) : (
                              <div className="h-32 w-32 rounded-lg bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                                No Thumbnail
                              </div>
                            )}

                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800 dark:text-white/90">
                                {video.title}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {shortDescription}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* TYPE */}
                        <TableCell className="px-5 py-4 text-start">
                          {typeLabels[video.type ?? ""] ?? "-"}
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex items-center gap-0">
                            {!canEdit && !canDelete && (
                              <span className="text-gray-400">
                                No Actions
                              </span>
                            )}
                            {canEdit && (
                              <Button
                                size="xs"
                                variant="warning"
                                onClick={() => handleEdit(video.id)}
                              >
                                Edit
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                size="xs"
                                variant="danger"
                                className="ml-2"
                                onClick={() => handleDelete(video.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export default withPermission(
  PortofolioVideoPage,
  "view-portofolio-video"
);
