"use client";

import React, { useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea"; // ✅ Import TextArea
import Button from "@/components/ui/button/Button";

type StepDetail = {
  sub_title: string;
  description: string;
};

function CreateStepPayment() {
  const [stepNumber, setStepNumber] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState<StepDetail[]>([{ sub_title: "", description: "" }]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const addDetailRow = () => setDetails([...details, { sub_title: "", description: "" }]);
  const removeDetailRow = (index: number) => setDetails(details.filter((_, i) => i !== index));
  const handleDetailChange = (index: number, field: "sub_title" | "description", value: string) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (stepNumber === "" || details.some((d) => !d.sub_title || !d.description)) {
      alert("Step number dan semua subjudul + deskripsi harus diisi!");
      return;
    }

    const body = JSON.stringify({
      step_number: Number(stepNumber),
      title,
      details,
    });

    setLoading(true);
    try {
      const res = await fetch("/api/backend/steppayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan step payment");
      }

      router.push("/backend/steppayment");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Step Payment" />
      <ComponentCard title="Form Tambah Step Payment">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Step Number</Label>
            <Input
              type="number"
              name="stepNumber"
              min={"1"}
              required
              value={String(stepNumber)}
              onChange={(e) => setStepNumber(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Masukkan nomor step"
              className="text-gray-800 dark:text-white/90"
            />
          </div>

          <div>
            <Label>Judul</Label>
            <Input
              type="text"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul Step Payment"
              className="text-gray-800 dark:text-white/90"
            />
          </div>

          <div className="space-y-4">
            {details.map((detail, index) => (
              <div
                key={index}
                className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 relative bg-white dark:bg-gray-800"
              >
                <div className="mb-2">
                  <Label>Sub Judul</Label>
                  <Input
                    type="text"
                    placeholder="Sub Judul"
                    value={detail.sub_title}
                    onChange={(e) => handleDetailChange(index, "sub_title", e.target.value)}
                    required
                    className="text-gray-800 dark:text-white/90"
                  />
                </div>

                <div className="mb-2">
                  <Label>Deskripsi</Label>
                  <TextArea
                    placeholder="Deskripsi"
                    value={detail.description}
                    onChange={(value) => handleDetailChange(index, "description", value)}
                    rows={4}
                    className="text-gray-800 dark:text-white/90"
                  />
                </div>

                {details.length > 1 && (
                  <Button
                    size="xs"
                    variant="danger"
                    type="button"
                    onClick={() => removeDetailRow(index)}
                    className="mt-2"
                  >
                    Hapus
                  </Button>
                )}
              </div>
            ))}

            <Button size="sm" variant="primary" type="button" onClick={addDetailRow}>
              Tambah Sub Judul
            </Button>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              size="sm"
              variant="danger"
              type="button"
              onClick={() => router.back()}
              className="mr-2"
              disabled={loading}
            >
              Kembali
            </Button>

            <Button size="sm" variant="green" type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

export default withPermission(CreateStepPayment, "add-steppayment");
