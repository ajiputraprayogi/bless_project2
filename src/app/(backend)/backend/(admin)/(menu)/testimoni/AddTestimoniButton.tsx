"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

// Ganti nama komponen menjadi AddTestimoniButton
export default function AddTestimoniButton() {
  const router = useRouter();

  function handleAdd() {
    // PERUBAHAN UTAMA: Arahkan ke halaman create testimoni
    router.push("/backend/testimoni/create"); 
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Testimoni
    </Button>
  );
}