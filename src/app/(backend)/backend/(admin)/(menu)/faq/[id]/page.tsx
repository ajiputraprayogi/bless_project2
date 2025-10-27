"use client";

import React, { useEffect, useState } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import SkeletonDefault from "@/components/skeleton/Default";

function EditFaq() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sortOrder, setSortOrder] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    document.title = "Edit FAQ | Admin Panel";

    async function fetchFaq() {
      try {
        const res = await fetch(`/api/backend/faq/${params.id}`);
        if (!res.ok) throw new Error("Gagal memuat data FAQ");

        const data = await res.json();
        setQuestion(data.question || "");
        setAnswer(data.answer || "");
        setSortOrder(data.sortOrder ?? "");
      } catch (error) {
        console.error(error);
        alert("Gagal memuat data FAQ");
      } finally {
        setInitialLoading(false);
      }
    }

    fetchFaq();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/backend/faq/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          answer,
          sortOrder: sortOrder === "" ? 0 : Number(sortOrder),
        }),
      });

      if (!res.ok) throw new Error("Gagal update data FAQ");

      router.push("/backend/faq");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update FAQ");
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <>
        <PageBreadcrumb pageTitle="Data FAQ" />
        <ComponentCard title="Form Edit FAQ">
          <SkeletonDefault />
        </ComponentCard>
      </>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit FAQ" />
      <ComponentCard title="Form Edit FAQ">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div>
            <Label>Pertanyaan</Label>
            <Input
              type="text"
              id="question"
              name="question"
              value={question}
              required
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Masukkan pertanyaan FAQ"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Jawaban</Label>
            <textarea
              id="answer"
              name="answer"
              value={answer}
              required
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Masukkan jawaban FAQ"
              className="w-full rounded-md border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700"
              disabled={loading}
            />
          </div>

          <div>
            <Label>Urutan</Label>
            <Input
              type="number"
              id="sortOrder"
              name="sortOrder"
              min="0"
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Masukkan urutan tampil"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              className="mr-2"
              variant="danger"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                router.back();
              }}
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

export default withPermission(EditFaq, "edit-faq");
