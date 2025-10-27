"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddContactButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/kontak/create"); // ✅ arahkan ke halaman tambah kontak
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
