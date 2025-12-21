"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";

export default function AddPortofolioVideoButton() {
  const router = useRouter();

  const handleAdd = (): void => {
    // Arahkan ke halaman create portofolio video
    router.push("/backend/animasi/create");
  };

  return (
    <Button
      size="xs"
      variant="primary"
      type="button"
      onClick={handleAdd}
    >
      Tambah Video
    </Button>
  );
}
