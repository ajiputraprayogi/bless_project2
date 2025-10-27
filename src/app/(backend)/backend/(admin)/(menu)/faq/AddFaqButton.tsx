"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddFaqButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/faq/create"); // ✅ arahkan ke halaman tambah FAQ
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah FAQ
    </Button>
  );
}
