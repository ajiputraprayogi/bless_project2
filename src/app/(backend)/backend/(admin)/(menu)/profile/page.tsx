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

type Misi = {
  id: number;
  text: string;
};

type Profile = {
  id: number;
  sejarah: string;
  visi: string;
  misi: Misi[];
};

function ProfilePage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } =
    usePermissions();
  const [allProfile, setAllProfile] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // Permissions
  const canAdd = useMemo(
    () => hasPermission(userPermissions, "add-profile"),
    [userPermissions]
  );
  const canEdit = useMemo(
    () => hasPermission(userPermissions, "edit-profile"),
    [userPermissions]
  );
  const canDelete = useMemo(
    () => hasPermission(userPermissions, "delete-profile"),
    [userPermissions]
  );

  useEffect(() => {
    document.title = "Data Profile | Admin Panel";
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/profile", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data Profile");
      const data = await res.json();
      setAllProfile(data);
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

  function handleEdit(id: number) {
    router.push(`/backend/profile/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus Profile ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/profile/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus Profile");

      setAllProfile((prev) => prev.filter((p) => p.id !== id));
      Swal.fire("Terhapus!", "Profile berhasil dihapus.", "success");
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
        <PageBreadcrumb pageTitle="Data Profile" />
        <ComponentCard title="Data Profile Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Profile" />
      <ComponentCard
        title="Data Profile Table"
        headerRight={
          canAdd && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => router.push("/backend/profile/create")}
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
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Sejarah
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Visi
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Misi
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
                  {allProfile.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="text-gray-600 dark:text-gray-300 line-clamp-2">
                          {p.sejarah}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="text-gray-600 dark:text-gray-300 line-clamp-2">
                          {p.visi}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        {p.misi.length > 0 ? (
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                            {p.misi.map((m) => (
                              <li key={m.id}>{m.text}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">Belum ada misi</span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {!canEdit && !canDelete && (
                            <span className="text-gray-400">No Actions</span>
                          )}
                          {canEdit && (
                            <Button
                              size="xs"
                              variant="warning"
                              onClick={() => handleEdit(p.id)}
                            >
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              size="xs"
                              variant="danger"
                              onClick={() => handleDelete(p.id)}
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

export default withPermission(ProfilePage, "view-profile");
