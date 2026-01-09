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
import AddTestimoniButton from "./AddDummyTestiButton";

// ================================
// TYPE DATA (dummy_testi)
// ================================
type DummyTesti = {
  id: number;
  client: string;
  message: string;
  created_at: string;
  updated_at: string;
};

function DummyTestiPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } =
    usePermissions();

  const [data, setData] = useState<DummyTesti[]>([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // PERMISSIONS
  // ================================
  const canAdd = useMemo(
    () => hasPermission(userPermissions, "add-dummy-testi"),
    [userPermissions]
  );
  const canEdit = useMemo(
    () => hasPermission(userPermissions, "edit-dummy-testi"),
    [userPermissions]
  );
  const canDelete = useMemo(
    () => hasPermission(userPermissions, "delete-dummy-testi"),
    [userPermissions]
  );

  useEffect(() => {
    document.title = "Data Dummy Testimoni | Admin Panel";
    fetchData();
  }, []);

  // ================================
  // FETCH DATA
  // ================================
  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/dummy_testi", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data dummy testimoni");
      const json = await res.json();
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
  function handleEdit(id: number) {
    router.push(`/backend/dummy_testi/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/dummy_testi/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus data");

      setData((prev) => prev.filter((item) => item.id !== id));
      Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
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
        <PageBreadcrumb pageTitle="Data Dummy Testimoni" />
        <ComponentCard title="Data Dummy Testimoni Table">
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
      <PageBreadcrumb pageTitle="Data Dummy Testimoni" />
      <ComponentCard
        title="Data Dummy Testimoni Table"
        headerRight={canAdd && <AddTestimoniButton />}
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
                      Klien
                    </TableCell>

                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-1/2"
                    >
                      Pesan
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
                  {data.map((item) => {
                    const fullMessage = item.message ?? "";
                    const shortMessage =
                      fullMessage.length > 150
                        ? fullMessage.slice(0, 150) + "..."
                        : fullMessage || "Tidak ada pesan";

                    return (
                      <TableRow key={item.id}>
                        {/* Kolom Klien */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item.client}
                          </span>
                        </TableCell>

                        {/* Kolom Pesan */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start max-w-sm">
                          <span className="block text-gray-800 text-sm dark:text-white/80">
                            {shortMessage}
                          </span>
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

export default withPermission(DummyTestiPage, "view-dummy-testi");
