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

type Paket = {
  id: number;
  name: string;
  harga: string;
  fitur: { id: number; fitur: string }[];
};

function PaketPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } = usePermissions();
  const [allPaket, setAllPaket] = useState<Paket[]>([]);
  const [loading, setLoading] = useState(true);

  // Permissions
  const canAdd = useMemo(() => hasPermission(userPermissions, "add-paket"), [userPermissions]);
  const canEdit = useMemo(() => hasPermission(userPermissions, "edit-paket"), [userPermissions]);
  const canDelete = useMemo(() => hasPermission(userPermissions, "delete-paket"), [userPermissions]);

  useEffect(() => {
    document.title = "Data Paket | Admin Panel";
    fetchPaket();
  }, []);

  async function fetchPaket() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/paket", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data paket");
      const data = await res.json();
      setAllPaket(data);
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: number) {
    router.push(`/backend/paket/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus paket ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/paket/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus paket");

      setAllPaket((prev) => prev.filter((p) => p.id !== id));
      Swal.fire("Terhapus!", "Paket berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Paket" />
        <ComponentCard title="Data Paket Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Paket" />
      <ComponentCard
        title="Data Paket Table"
        headerRight={
          canAdd && (
            <Button size="sm" variant="primary" onClick={() => router.push("/backend/paket/create")}>
              Tambah
            </Button>
          )
        }
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[700px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Nama Paket
                    </TableCell>
                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Harga
                    </TableCell>
                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Fitur
                    </TableCell>
                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {allPaket.map((paket) => (
                    <TableRow key={paket.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {paket.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="text-blue-600 font-semibold">{paket.harga}</span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                          {paket.fitur.map((f) => (
                            <li key={f.id}>{f.fitur}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {!canEdit && !canDelete && <span className="text-gray-400">No Actions</span>}
                          {canEdit && (
                            <Button size="xs" variant="warning" onClick={() => handleEdit(paket.id)}>
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button size="xs" variant="danger" onClick={() => handleDelete(paket.id)}>
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

export default withPermission(PaketPage, "view-paket");
