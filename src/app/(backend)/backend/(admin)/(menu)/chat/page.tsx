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

type Chat = {
  id: number;
  title: string;
  description: string;
  discount: number;
};

function ChatPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } = usePermissions();
  const [allChat, setAllChat] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // Permissions
  const canAdd = useMemo(() => hasPermission(userPermissions, "add-chat"), [userPermissions]);
  const canEdit = useMemo(() => hasPermission(userPermissions, "edit-chat"), [userPermissions]);
  const canDelete = useMemo(() => hasPermission(userPermissions, "delete-chat"), [userPermissions]);

  useEffect(() => {
    document.title = "Data Chat | Admin Panel";
    fetchChat();
  }, []);

  async function fetchChat() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/chat", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data chat");
      const data = await res.json();
      setAllChat(data);
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: number) {
    router.push(`/backend/chat/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus chat ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/chat/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus chat");

      setAllChat((prev) => prev.filter((c) => c.id !== id));
      Swal.fire("Terhapus!", "Chat berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data Chat" />
        <ComponentCard title="Data Chat Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Data Chat" />
      <ComponentCard
        title="Data Chat Table"
        headerRight={
          canAdd && (
            <Button size="sm" variant="primary" onClick={() => router.push("/backend/chat/create")}>
              Tambah Chat
            </Button>
          )
        }
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Judul
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Deskripsi
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                    >
                      Diskon
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
                  {allChat.map((chat) => (
                    <TableRow key={chat.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {chat.title}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <span className="text-gray-600 dark:text-gray-300">{chat.description}</span>
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-center">
                        <span className="text-green-600 font-semibold">{chat.discount}%</span>
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
                              onClick={() => handleEdit(chat.id)}
                            >
                              Edit
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              size="xs"
                              variant="danger"
                              onClick={() => handleDelete(chat.id)}
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

export default withPermission(ChatPage, "view-chat");
