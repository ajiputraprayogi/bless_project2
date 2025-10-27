"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddTimButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/tim/create"); // ✅ arahkan ke halaman tambah tim
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah
    </Button>
  );
}
