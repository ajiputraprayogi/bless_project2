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

type PaymentStepDetail = {
  id: number;
  sub_title: string;
  description: string;
  createdat: string;
  updatedat: string;
};

type PaymentStep = {
  id: number;
  step_number: number;
  title?: string | null;
  payment_step_detail: PaymentStepDetail[];
  createdat: string;
  updatedat: string;
};

function StepPaymentPage() {
  const router = useRouter();
  const { permissions: userPermissions, loading: permissionsLoading } = usePermissions();
  const [steps, setSteps] = useState<PaymentStep[]>([]);
  const [loading, setLoading] = useState(true);

  const canAdd = useMemo(() => hasPermission(userPermissions, "add-steppayment"), [userPermissions]);
  const canEdit = useMemo(() => hasPermission(userPermissions, "edit-steppayment"), [userPermissions]);
  const canDelete = useMemo(() => hasPermission(userPermissions, "delete-steppayment"), [userPermissions]);

  useEffect(() => {
    document.title = "Step Payment | Admin Panel";
    fetchSteps();
  }, []);

  async function fetchSteps() {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/steppayment", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat data step payment");
      const data = await res.json();
      // Pastikan setiap payment_step_detail selalu array
      setSteps(
        data.map((s: any) => ({
          ...s,
          payment_step_detail: s.payment_step_detail || [],
        }))
      );
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id: number) {
    router.push(`/backend/steppayment/${id}`);
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus step ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#d33",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/backend/steppayment/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus step payment");

      setSteps((prev) => prev.filter((s) => s.id !== id));
      Swal.fire("Terhapus!", "Step payment berhasil dihapus.", "success");
    } catch (err: unknown) {
      Swal.fire("Error", err instanceof Error ? err.message : "Terjadi kesalahan", "error");
    }
  }

  if (loading || permissionsLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Step Payment" />
        <ComponentCard title="Step Payment Table">
          <SkeletonTable />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Step Payment" />
      <ComponentCard
        title="Step Payment Table"
        headerRight={
          canAdd && (
            <Button size="sm" variant="primary" onClick={() => router.push("/backend/steppayment/create")}>
              Tambah Step
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
                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Step
                    </TableCell>
                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Judul
                    </TableCell>
                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                      Detail (Sub Judul + Deskripsi)
                    </TableCell>
                    <TableCell className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {steps.map((step) => {
                    // Gabungkan semua detail ke dalam satu string atau komponen
                    const detailsContent = step.payment_step_detail.map((detail, index) => (
                      <div key={detail.id} className={index > 0 ? "mt-2" : ""}>
                        <strong className="text-gray-800 dark:text-white/90">{detail.sub_title}</strong>
                        <p className="text-gray-600 dark:text-white/90">{detail.description}</p>
                      </div>
                    ));

                    return (
                      <TableRow key={step.id}>
                        <TableCell className="px-5 py-4 text-center text-gray-800 dark:text-white/90">
                          {step.step_number}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white/90">
                          {step.title || "-"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          {detailsContent}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {canEdit && (
                              <Button size="xs" variant="warning" onClick={() => handleEdit(step.id)}>Edit</Button>
                            )}
                            {canDelete && (
                              <Button size="xs" variant="danger" onClick={() => handleDelete(step.id)}>Delete</Button>
                            )}
                            {!canEdit && !canDelete && <span className="text-gray-400">No Actions</span>}
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

export default withPermission(StepPaymentPage, "view-steppayment");
