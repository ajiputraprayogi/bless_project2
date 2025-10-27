"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddChatButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/chat/create"); // ✅ arahkan ke halaman tambah chat
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
