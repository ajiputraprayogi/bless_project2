"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddStepPaymentButton() {
  const router = useRouter();

  function handleAdd() {
    // Arahkan ke halaman create step payment
    router.push("/backend/steppayment/create");
  }

  return (
    <Button
      size="sm" // bisa diganti xs/ sm sesuai UI konsisten
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Step Payment
    </Button>
  );
}
