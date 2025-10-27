"use client";

import React, { useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";

function CreateFaq() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sortOrder, setSortOrder] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body = JSON.stringify({
      question,
      answer,
      sortOrder: sortOrder === "" ? 0 : Number(sortOrder),
    });

    setLoading(true);

    try {
      const res = await fetch("/api/backend/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menambahkan FAQ");
      }

      router.push("/backend/faq");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah FAQ" />
      <ComponentCard title="Form Tambah FAQ">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label>Pertanyaan</Label>
            <Input
              type="text"
              name="question"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Masukkan pertanyaan FAQ"
            />
          </div>

          <div>
            <Label>Jawaban</Label>
            <textarea
              name="answer"
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Masukkan jawaban FAQ"
              className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>

          <div>
            <Label>Urutan</Label>
            <Input
              type="number"
              name="sortOrder"
              min="0"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Masukkan urutan tampil (misal: 1)"
            />
          </div>

          <div className="flex justify-end">
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

export default withPermission(CreateFaq, "add-faq");
