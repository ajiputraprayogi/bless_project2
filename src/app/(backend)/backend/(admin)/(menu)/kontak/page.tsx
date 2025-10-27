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
import AddContactButton from "./AddContactButton";
import Button from "@/components/ui/button/Button"; // ✅ pakai Button custom

type Contact = {
  id: number;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
};

function ContactPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } = usePermissions();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const canAdd = useMemo(() => hasPermission(userPermissions, "add-kontak"), [userPermissions]);
  const canEdit = useMemo(() => hasPermission(userPermissions, "edit-kontak"), [userPermissions]);
  const canDelete = useMemo(() => hasPermission(userPermissions, "delete-kontak"), [userPermissions]);

  useEffect(() => {
    document.title = "Data Kontak | Admin Panel";
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/kontak", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data kontak");
      const data = await res.json();
      setContacts(data);
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: number) {
    router.push(`/backend/kontak/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus kontak ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/kontak/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus kontak");

      setContacts((prev) => prev.filter((c) => c.id !== id));

      Swal.fire("Terhapus!", "Kontak berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Kontak" />
        <ComponentCard
          title="Data Kontak Table"
          headerRight={canAdd && <AddContactButton />}
        >
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Kontak" />
      <ComponentCard
        title="Data Kontak Table"
        headerRight={canAdd && <AddContactButton />}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Platform
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Link
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {contact.platform}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <a href={contact.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          {contact.url}
                        </a>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-center text-theme-sm dark:text-gray-400">
                        <div className="flex justify-center gap-2">
                          {canEdit && (
                            <Button
                              size="xs"
                              variant="warning"
                              onClick={() => handleEdit(contact.id)}
                            >
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              size="xs"
                              variant="danger"
                              onClick={() => handleDelete(contact.id)}
                            >
                              Hapus
                            </Button>
                          )}
                          {!canEdit && !canDelete && (
                            <span className="text-gray-400">No Actions</span>
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

export default withPermission(ContactPage, "view-kontak");
