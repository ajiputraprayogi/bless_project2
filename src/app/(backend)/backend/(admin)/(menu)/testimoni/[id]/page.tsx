"use client";

import React, { useState, useEffect, useMemo } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import SkeletonDefault from "@/components/skeleton/Default";
import FileInput from "@/components/form/input/FileInput";
import { XCircle } from "lucide-react";

// Tipe data untuk Gambar (bisa berupa URL lama atau File baru)
type ImageData = {
    // Digunakan untuk URL jika sudah ada, atau URL.createObjectURL jika file baru
    url: string; 
    // File object jika file baru di-upload, null jika menggunakan URL lama
    file: File | null; 
    // Menandakan apakah gambar lama dihapus (hanya berlaku jika url ada dan file null)
    isDeleted: boolean; 
};

// Ganti nama komponen menjadi EditTestimoni
function EditTestimoni() {
    const router = useRouter();
    const params = useParams();
    const id = typeof params?.id === "string" ? params.id : null;

    // State Data Testimoni
    const [client, setClient] = useState("");
    const [message, setMessage] = useState("");
    const [alt, setAlt] = useState("");
    const [video, setVideo] = useState("");

    // State untuk Gambar
    const [avatar, setAvatar] = useState<ImageData>({ url: "", file: null, isDeleted: false });
    const [srcImage, setSrcImage] = useState<ImageData>({ url: "", file: null, isDeleted: false });

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Handler untuk mengubah file tunggal (Avatar atau Src)
    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setState: React.Dispatch<React.SetStateAction<ImageData>>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Cleanup URL lama sebelum membuat URL baru
        setState((prev) => {
            if (prev.url && prev.file) URL.revokeObjectURL(prev.url); 
            return {
                file: file,
                url: URL.createObjectURL(file), // URL baru dari file baru
                isDeleted: false,
            };
        });

        event.target.value = ""; // Reset input
    };

    // Handler untuk menghapus/mereset gambar
    const handleRemoveFile = (setState: React.Dispatch<React.SetStateAction<ImageData>>) => {
        setState((prev) => {
            // Cleanup URL objek jika itu adalah file baru
            if (prev.file && prev.url) URL.revokeObjectURL(prev.url);
            
            // Tandai isDeleted true HANYA jika gambar sebelumnya berasal dari URL lama (bukan file baru)
            const wasExistingImage = prev.file === null && prev.url !== "";

            return { 
                file: null, 
                url: "",
                isDeleted: wasExistingImage, // Tandai untuk dihapus di backend jika URL lama ada
            };
        });
    };

    // Cleanup URL objek saat komponen unmount
    useEffect(() => {
        return () => {
            if (avatar.file && avatar.url) URL.revokeObjectURL(avatar.url);
            if (srcImage.file && srcImage.url) URL.revokeObjectURL(srcImage.url);
        };
    }, [avatar.file, srcImage.file]);


    // Fetch Data
    useEffect(() => {
        document.title = "Edit Testimoni | Admin Panel";

        async function fetchTestimoni() {
            if (!id) return;

            try {
                // PERUBAHAN ENDPOINT
                const res = await fetch(`/api/backend/testimoni/${id}`);
                if (!res.ok) throw new Error("Gagal memuat testimoni");

                const data = await res.json();
                setClient(data.client || "");
                setMessage(data.message || "");
                setAlt(data.alt || "");
                setVideo(data.video || "");

                // Mengisi state gambar yang sudah ada
                setAvatar({ url: data.avatar || "", file: null, isDeleted: false });
                setSrcImage({ url: data.src || "", file: null, isDeleted: false });

            } catch (error) {
                console.error(error);
                alert("Gagal memuat data testimoni");
                router.push("/backend/testimoni");
            } finally {
                setInitialLoading(false);
            }
        }

        fetchTestimoni();
    }, [id]);


    // Update Logika Submit
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // 1. VALIDASI
        if (!client || !message) {
            alert("Error: Nama Klien dan Pesan wajib diisi.");
            return;
        }
        
        // Cek bahwa setidaknya ada URL/File untuk avatar dan src
        if (!avatar.url && avatar.file === null && !avatar.isDeleted) {
            alert("Error: Avatar klien wajib diisi.");
            return;
        }
        if (!srcImage.url && srcImage.file === null && !srcImage.isDeleted) {
            alert("Error: Gambar Desain terkait wajib diisi.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("client", client);
            formData.append("message", message);
            formData.append("alt", alt);
            formData.append("video", video);
            
            // Logika File: Hanya kirim file jika ada file baru (file !== null)
            // Atau kirim sinyal hapus jika isDeleted === true
            
            // 1. Avatar
            if (avatar.file) {
                formData.append("new_avatar", avatar.file, avatar.file.name);
            } else if (avatar.isDeleted) {
                formData.append("delete_avatar", "true");
            }

            // 2. Src Image
            if (srcImage.file) {
                formData.append("new_src", srcImage.file, srcImage.file.name);
            } else if (srcImage.isDeleted) {
                formData.append("delete_src", "true");
            }
            
            // PERUBAHAN ENDPOINT & METHOD
            const res = await fetch(`/api/backend/testimoni/${id}`, {
                method: "PATCH", 
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Gagal update testimoni");
            }

            // Ganti rute redirect
            router.push("/backend/testimoni");
        } catch (error) {
            console.error(error);
            alert((error as Error).message || "Terjadi kesalahan saat update testimoni");
        } finally {
            setLoading(false);
        }
    }
    
    // Komponen Helper untuk Preview File Tunggal (diadaptasi)
    const SingleFilePreview = ({ imageData, onRemove, label }: { imageData: ImageData, onRemove: () => void, label: string }) => {
        if (!imageData.url) return null;
        
        return (
            <div className="mt-4 flex flex-wrap gap-4">
                <div className="relative w-40 h-40 border border-gray-300 rounded-lg overflow-hidden group">
                    <img src={imageData.url} alt={label} className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={onRemove}
                        className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={loading}
                    >
                        <XCircle size={20} />
                    </button>
                    <div className="absolute bottom-0 w-full p-1 bg-black/50 text-white text-xs text-center truncate">
                        {imageData.file ? imageData.file.name : "Gambar Lama"}
                    </div>
                </div>
            </div>
        );
    };


    if (initialLoading) {
        return (
            <>
                <PageBreadcrumb pageTitle="Data Testimoni" />
                <ComponentCard title="Form Edit Testimoni">
                    <SkeletonDefault />
                </ComponentCard>
            </>
        );
    }

    return (
        <div>
            <PageBreadcrumb pageTitle="Edit Testimoni" />
            <ComponentCard title="Form Edit Testimoni">
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* NAMA KLIEN */}
                    <div>
                        <Label>Nama Klien <span className="text-red-500">*</span></Label>
                        <Input
                            type="text"
                            value={client}
                            required
                            onChange={(e) => setClient(e.target.value)}
                            placeholder="Contoh: Budi Susanto"
                            disabled={loading}
                        />
                    </div>

                    {/* PESAN TESTIMONI */}
                    <div>
                        <Label>Pesan Testimoni <span className="text-red-500">*</span></Label>
                        <textarea
                            className="w-full rounded-md border border-gray-300 p-2"
                            rows={4}
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tulis pesan testimoni dari klien di sini..."
                            disabled={loading}
                        />
                    </div>
                    
                    {/* ALT (KETERANGAN DESAIN) */}
                    <div>
                        <Label>Keterangan Desain (Alt)</Label>
                        <Input
                            type="text"
                            value={alt}
                            onChange={(e) => setAlt(e.target.value)}
                            placeholder="Contoh: Desain Rumah 1, Desain Interior Bali"
                            disabled={loading}
                        />
                    </div>

                    {/* URL VIDEO (OPSIONAL) */}
                    <div>
                        <Label>Link Video YouTube (Opsional)</Label>
                        <Input
                            type="url"
                            value={video}
                            onChange={(e) => setVideo(e.target.value)}
                            placeholder="Contoh: https://www.youtube.com/embed/dQw4w9WgXcQ"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="text-lg font-semibold mb-3 md:col-span-2">Manajemen Gambar</h3>

                        {/* UPLOAD AVATAR */}
                        <div>
                            <Label>Upload Avatar Klien <span className="text-red-500">*</span></Label>
                            {avatar.url ? (
                                <SingleFilePreview 
                                    imageData={avatar} 
                                    onRemove={() => handleRemoveFile(setAvatar)} 
                                    label="Avatar Klien"
                                />
                            ) : (
                                <FileInput
                                    onChange={(e) => handleFileChange(e, setAvatar)}
                                    accept=".png, .jpg, .jpeg, .webp"
                                    disabled={loading}
                                />
                            )}
                            {avatar.isDeleted && <p className="text-sm text-red-500 mt-1">Avatar akan **dihapus** saat disimpan.</p>}
                        </div>

                        {/* UPLOAD GAMBAR DESAIN (SRC) */}
                        <div>
                            <Label>Upload Gambar Desain Terkait (SRC) <span className="text-red-500">*</span></Label>
                            {srcImage.url ? (
                                <SingleFilePreview 
                                    imageData={srcImage} 
                                    onRemove={() => handleRemoveFile(setSrcImage)} 
                                    label="Gambar Desain"
                                />
                            ) : (
                                <FileInput
                                    onChange={(e) => handleFileChange(e, setSrcImage)}
                                    accept=".png, .jpg, .jpeg, .webp"
                                    disabled={loading}
                                />
                            )}
                            {srcImage.isDeleted && <p className="text-sm text-red-500 mt-1">Gambar Desain akan **dihapus** saat disimpan.</p>}
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end pt-4">
                        <Button
                            size="sm"
                            className="mr-2"
                            variant="danger"
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Kembali
                        </Button>

                        <Button size="sm" variant="green" type="submit" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </div>
                </form>
            </ComponentCard>
        </div>
    );
}

// Ganti permission
export default withPermission(EditTestimoni, "edit-testimoni");