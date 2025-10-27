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
import AddTimButton from "./AddTimButton";
import Button from "@/components/ui/button/Button";

type Tim = {
  id: number;
  nama: string;
  posisi: string;
  image?: string | null;
};

function TimPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } = usePermissions();
  const [allTim, setAllTim] = useState<Tim[]>([]);
  const [loading, setLoading] = useState(true);

  // Permissions
  const canAdd = useMemo(() => hasPermission(userPermissions, "add-tim"), [userPermissions]);
  const canEdit = useMemo(() => hasPermission(userPermissions, "edit-tim"), [userPermissions]);
  const canDelete = useMemo(() => hasPermission(userPermissions, "delete-tim"), [userPermissions]);

  useEffect(() => {
    document.title = "Data Tim | Admin Panel";
    fetchTim();
  }, []);

  async function fetchTim() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/tim", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data tim");
      const data = await res.json();
      setAllTim(data);
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: number) {
    router.push(`/backend/tim/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus anggota tim ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/tim/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus anggota tim");

      setAllTim((prev) => prev.filter((t) => t.id !== id));
      Swal.fire("Terhapus!", "Anggota tim berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Tim" />
        <ComponentCard title="Data Tim Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Tim" />
      <ComponentCard
        title="Data Tim Table"
        headerRight={canAdd && <AddTimButton />}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Anggota Tim
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {allTim.map((tim) => (
                    <TableRow key={tim.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          {tim.image ? (
                            <img
                              src={tim.image}
                              alt={tim.nama}
                              className="h-32 w-32 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                            />
                          ) : (
                            <div className="h-32 w-32 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm text-gray-500">
                              No Image
                            </div>
                          )}

                          <div className="flex flex-col">
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {tim.nama}
                            </span>
                            <span className="block text-gray-500 text-sm dark:text-gray-400">
                              {tim.posisi}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-0">
                          {!canEdit && !canDelete && (
                            <span className="text-gray-400">No Actions</span>
                          )}
                          {canEdit && (
                            <Button
                              size="xs"
                              variant="warning"
                              onClick={() => handleEdit(tim.id)}
                            >
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              size="xs"
                              variant="danger"
                              className="ml-2"
                              onClick={() => handleDelete(tim.id)}
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

export default withPermission(TimPage, "view-tim");
