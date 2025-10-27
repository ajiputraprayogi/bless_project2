"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddProfileButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/profile/create"); // ✅ arahkan ke halaman tambah Profile
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Profile
    </Button>
  );
}
