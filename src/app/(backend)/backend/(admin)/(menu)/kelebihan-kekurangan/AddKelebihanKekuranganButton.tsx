"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddKelebihanKekuranganButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/kelebihan-kekurangan/create"); // ✅ arahkan ke halaman tambah Kelebihan & Kekurangan
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Kelebihan/Kekurangan
    </Button>
  );
}
