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

type Detail = {
  id: number;
  detail: string;
};

type KelebihanKekurangan = {
  id: number;
  judul: string;
  type: string;
  kelebihan_kekurangan_detail: Detail[];
};

function KelebihanKekuranganPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } = usePermissions();
  const [data, setData] = useState<KelebihanKekurangan[]>([]);
  const [loading, setLoading] = useState(true);

  // Permissions
  const canAdd = useMemo(() => hasPermission(userPermissions, "add-kk"), [userPermissions]);
  const canEdit = useMemo(() => hasPermission(userPermissions, "edit-kk"), [userPermissions]);
  const canDelete = useMemo(() => hasPermission(userPermissions, "delete-kk"), [userPermissions]);

  useEffect(() => {
    document.title = "Data Kelebihan & Kekurangan | Admin Panel";
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/kelebihan-kekurangan", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data Kelebihan & Kekurangan");
      const data = await res.json();
      setData(data);
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: number) {
    router.push(`/backend/kelebihan-kekurangan/${id}`);
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
      const res = await fetch(`/api/backend/kelebihan-kekurangan/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus data");

      setData((prev) => prev.filter((item) => item.id !== id));
      Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Kelebihan & Kekurangan" />
        <ComponentCard title="Data Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Kelebihan & Kekurangan" />
      <ComponentCard
        title="Data Table"
        headerRight={
          canAdd && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => router.push("/backend/kelebihan-kekurangan/create")}
            >
              Tambah
            </Button>
          )
        }
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Judul
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Tipe
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Detail
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {item.judul}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <span
                          className={
                            item.type === "kelebihan"
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {item.kelebihan_kekurangan_detail.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                            {item.kelebihan_kekurangan_detail.map((d) => (
                              <li key={d.id}>{d.detail}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">Belum ada detail</span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {!canEdit && !canDelete && (
                            <span className="text-gray-400">No Actions</span>
                          )}
                          {canEdit && (
                            <Button size="xs" variant="warning" onClick={() => handleEdit(item.id)}>
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button size="xs" variant="danger" onClick={() => handleDelete(item.id)}>
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

export default withPermission(KelebihanKekuranganPage, "view-kk");
