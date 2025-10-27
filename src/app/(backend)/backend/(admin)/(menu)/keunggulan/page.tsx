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
import AddKeunggulanButton from "./AddKeunggulanButton";
import Button from "@/components/ui/button/Button";

// Tipe disesuaikan
type Keunggulan = {
  id: number;
  title: string;
  slug: string; // Tetap ada di tipe data, tapi tidak ditampilkan
  image?: string | null;
  description?: string | null;
};

function KeunggulanPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } = usePermissions();
  const [allKeunggulan, setAllKeunggulan] = useState<Keunggulan[]>([]);
  const [loading, setLoading] = useState(true);

  // Sesuaikan Permissions
  const canAdd = useMemo(() => hasPermission(userPermissions, "add-keunggulan"), [userPermissions]);
  const canEdit = useMemo(() => hasPermission(userPermissions, "edit-keunggulan"), [userPermissions]);
  const canDelete = useMemo(() => hasPermission(userPermissions, "delete-keunggulan"), [userPermissions]);

  useEffect(() => {
    document.title = "Data Keunggulan | Admin Panel";
    fetchKeunggulan();
  }, []);

  // Sesuaikan nama fungsi dan endpoint API
  async function fetchKeunggulan() {
    setLoading(true);
    try {
      // Ganti endpoint ke /api/backend/keunggulan
      const res = await fetch("/api/backend/keunggulan", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data keunggulan");
      const data = await res.json();
      setAllKeunggulan(data);
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  // Sesuaikan path router
  function handleEdit(id: number) {
    router.push(`/backend/keunggulan/${id}`);
  }

  // Sesuaikan pesan dan endpoint API
  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus keunggulan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      // Ganti endpoint ke /api/backend/keunggulan/:id
      const res = await fetch(`/api/backend/keunggulan/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus keunggulan");

      setAllKeunggulan((prev) => prev.filter((p) => p.id !== id));
      Swal.fire("Terhapus!", "Keunggulan berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Keunggulan" />
        <ComponentCard title="Data Keunggulan Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Keunggulan" />
      <ComponentCard
        title="Data Keunggulan Table"
        headerRight={canAdd && <AddKeunggulanButton />}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Keunggulan
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {allKeunggulan.map((keunggulan) => {
                    const description = keunggulan.description ?? "";
                    const shortDescription =
                      description.length > 100
                        ? description.slice(0, 100) + "..."
                        : description || "Tidak ada deskripsi";

                    return (
                      <TableRow key={keunggulan.id}>
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-start gap-3"> {/* Ubah items-center jadi items-start */}
                            {keunggulan.image ? (
                              <img
                                src={keunggulan.image}
                                alt={keunggulan.title}
                                className="h-32 w-32 rounded-lg object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0" // Tambah flex-shrink-0
                              />
                            ) : (
                              <div className="h-32 w-32 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500 flex-shrink-0">
                                No Image
                              </div>
                            )}

                            <div className="flex flex-col">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {keunggulan.title} {/* Tampilkan title */}
                              </span>
                              {/* SLUG DIHAPUS DARI TAMPILAN */}
                              <span className="block text-gray-500 text-sm dark:text-gray-400 mt-1">
                                {shortDescription} {/* Tampilkan deskripsi singkat */}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-center">
                          <div className="flex items-center justify-center">
                            {!canEdit && !canDelete && (
                              <span className="text-gray-400">No Actions</span>
                            )}
                            {canEdit && (
                              <Button
                                size="xs"
                                variant="warning"
                                onClick={() => handleEdit(keunggulan.id)}
                              >
                                Edit
                              </Button>
                            )}
                            {canDelete && (
                              <Button
                                size="xs"
                                variant="danger"
                                className="ml-2"
                                onClick={() => handleDelete(keunggulan.id)}
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

// Sesuaikan permission default untuk komponen
export default withPermission(KeunggulanPage, "view-keunggulan");