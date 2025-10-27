"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddKeunggulanButton() {
  const router = useRouter();

  function handleAdd() {
    // ✅ Arahkan ke halaman create keunggulan
    router.push("/backend/keunggulan/create"); 
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Keunggulan {/* Teks tombol disesuaikan */}
    </Button>
  );
}