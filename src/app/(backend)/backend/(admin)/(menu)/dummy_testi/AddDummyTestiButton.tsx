"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddDummyTestiButton() {
  const router = useRouter();

  function handleAdd() {
    router.push("/backend/dummy_testi/create");
  }

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Dummy Testimoni
    </Button>
  );
}
