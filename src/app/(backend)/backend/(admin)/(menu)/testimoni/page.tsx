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
// Import komponen button Add yang disesuaikan
import AddTestimoniButton from "./AddTestimoniButton"; 
import Button from "@/components/ui/button/Button";

// Tipe data untuk setiap objek Testimoni (Sesuai dengan JSON dan DB)
type Testimoni = {
  id: number;
  client: string;
  avatar: string; // Path atau URL ke avatar klien
  src: string; // Path atau URL ke gambar desain
  alt: string;
  message: string;
  video: string; // URL video YouTube
};

// Ganti nama fungsi komponen menjadi TestimoniPage
function TestimoniPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } =
    usePermissions();
  // Ganti state untuk menampung data testimoni
  const [allTestimoni, setAllTestimoni] = useState<Testimoni[]>([]);
  const [loading, setLoading] = useState(true);

  // Ganti permissions check
  const canAdd = useMemo(
    () => hasPermission(userPermissions, "add-testimoni"),
    [userPermissions]
  );
  const canEdit = useMemo(
    () => hasPermission(userPermissions, "edit-testimoni"),
    [userPermissions]
  );
  const canDelete = useMemo(
    () => hasPermission(userPermissions, "delete-testimoni"),
    [userPermissions]
  );

  useEffect(() => {
    document.title = "Data Testimoni | Admin Panel";
    fetchTestimoni();
  }, []);

  // Ganti fungsi fetch
  async function fetchTestimoni() {
    setLoading(true);
    try {
      // PERUBAHAN ENDPOINT: Ganti ke endpoint Testimoni
      const res = await fetch("/api/backend/testimoni", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data testimoni");
      const data = await res.json();
      setAllTestimoni(data);
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

  // Ganti fungsi handler
  function handleEdit(id: number) {
    router.push(`/backend/testimoni/${id}`);
  }

  // Ganti fungsi delete
  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus testimoni ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/testimoni/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus testimoni");

      setAllTestimoni((prev) => prev.filter((p) => p.id !== id));
      Swal.fire("Terhapus!", "Testimoni berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire(
        "Error",
        err instanceof Error ? err.message : "Terjadi kesalahan",
        "error"
      );
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Testimoni" />
        <ComponentCard title="Data Testimoni Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Testimoni" />
      <ComponentCard
        title="Data Testimoni Table"
        // Ganti button add
        headerRight={canAdd && <AddTestimoniButton />}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            {/* Lebarkan min-width karena kolom pesan lebih panjang */}
            <div className="min-w-[1000px]"> 
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
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Video
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
                  {/* Ganti map allPortofolio menjadi allTestimoni */}
                  {allTestimoni.map((item) => {
                    // Ambil deskripsi/pesan untuk preview
                    const fullMessage = item.message ?? "";
                    const shortMessage =
                      fullMessage.length > 150
                        ? fullMessage.slice(0, 150) + "..."
                        : fullMessage || "Tidak ada pesan";

                    // Cek apakah ada URL video
                    const hasVideo = !!item.video;

                    return (
                      <TableRow key={item.id}>
                        {/* Kolom Klien (Avatar + Nama) */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            {/* Gunakan avatar klien */}
                            {item.avatar ? (
                              // Anggap path avatar seperti '/images/user/ferry.jpg' bisa diakses
                              <img
                                src={item.avatar} 
                                alt={item.client}
                                className="h-16 w-16 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                              />
                            ) : (
                              <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500">
                                No Avatar
                              </div>
                            )}

                            <div className="flex flex-col">
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {item.client}
                              </span>
                              <span className="block text-gray-500 text-sm dark:text-gray-400">
                                {item.alt}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Kolom Pesan */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start max-w-sm">
                          <span className="block text-gray-800 text-sm dark:text-white/80">
                            {shortMessage}
                          </span>
                        </TableCell>

                        {/* Kolom Video */}
                        <TableCell className="px-5 py-4 sm:px-6 text-start">
                          <span className={hasVideo ? "text-green-600 dark:text-green-400" : "text-gray-500"}>
                            {hasVideo ? "Ada" : "Tidak Ada"}
                          </span>
                        </TableCell>

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

// Ganti permission
export default withPermission(TestimoniPage, "view-testimoni");