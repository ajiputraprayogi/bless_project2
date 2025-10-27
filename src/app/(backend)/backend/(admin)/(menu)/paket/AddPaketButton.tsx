"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddPaketButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/paket/create"); // ✅ arahkan ke halaman tambah Paket
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Paket
    </Button>
  );
}
