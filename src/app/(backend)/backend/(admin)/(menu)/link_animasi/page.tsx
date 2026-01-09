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
import Button from "@/components/ui/button/Button";
import AddLinkAnimasiButton from "./AddLinkAnimasiButton";

// ================================
// TYPE DATA (link_animasi)
// ================================
type LinkAnimasi = {
  id: number;
  link: string;
  created_at: string;
  updated_at: string;
};

function LinkAnimasiPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } =
    usePermissions();

  const [data, setData] = useState<LinkAnimasi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ================================
  // PERMISSIONS
  // ================================
  const canAdd = useMemo(
    () => hasPermission(userPermissions, "add-link-animasi"),
    [userPermissions]
  );

  const canEdit = useMemo(
    () => hasPermission(userPermissions, "edit-link-animasi"),
    [userPermissions]
  );

  const canDelete = useMemo(
    () => hasPermission(userPermissions, "delete-link-animasi"),
    [userPermissions]
  );

  useEffect(() => {
    document.title = "Data Link 3D Animasi | Admin Panel";
    fetchData();
  }, []);

  // ================================
  // FETCH DATA
  // ================================
  async function fetchData(): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/link_animasi", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Gagal memuat Data Link 3D Animasi");
      }

      const json: LinkAnimasi[] = await res.json();
      setData(json);
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

  // ================================
  // ACTIONS
  // ================================
  function handleEdit(id: number): void {
    router.push(`/backend/link_animasi/${id}`);
  }

  async function handleDelete(id: number): Promise<void> {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus link ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/link_animasi/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus data");

      setData((prev) => prev.filter((item) => item.id !== id));
      Swal.fire("Terhapus!", "Link animasi berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "Terjadi kesalahan",
        "error"
      );
    }
  }

  // ================================
  // LOADING STATE
  // ================================
  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Link 3D Animasi" />
        <ComponentCard title="Data Link 3D Animasi Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  // ================================
  // RENDER
  // ================================
  return (
    <div>
      <PageBreadcrumb pageTitle="Data Link 3D Animasi" />
      <ComponentCard
        title="Data Link 3D Animasi Table"
        headerRight={canAdd && <AddLinkAnimasiButton />}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Link Animasi
                    </TableCell>

                    {/* <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Created
                    </TableCell> */}

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      {/* Kolom Link Animasi */}
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block font-medium text-blue-600 text-theme-sm hover:underline break-all dark:text-blue-400"
                        >
                          {item.link}
                        </a>
                      </TableCell>

                      {/* Kolom Created */}
                      {/* <TableCell className="px-5 py-4 sm:px-6 text-start text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </TableCell> */}

                      {/* Actions */}
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-0">
                          {!canEdit && !canDelete && (
                            <span className="text-gray-400">No Actions</span>
                          )}

                          {canEdit && (
                            <Button
                              size="xs"
                              variant="warning"
                              onClick={() => handleEdit(item.id)}
                            >
                              Edit
                            </Button>
                          )}

                          {canDelete && (
                            <Button
                              size="xs"
                              variant="danger"
                              className="ml-2"
                              onClick={() => handleDelete(item.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}

export default withPermission(LinkAnimasiPage, "view-link-animasi");
