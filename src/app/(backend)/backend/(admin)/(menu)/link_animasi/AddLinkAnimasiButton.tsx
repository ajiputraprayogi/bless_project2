"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddLinkAnimasiButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/link_animasi/create");
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Link Animasi
    </Button>
  );
}
