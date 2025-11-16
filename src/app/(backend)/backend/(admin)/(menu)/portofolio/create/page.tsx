// "use client";

// import React, { useState, useEffect, useRef, useMemo } from "react";
// import withPermission from "@/components/auth/withPermission";
// import { useRouter } from "next/navigation";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import ComponentCard from "@/components/common/ComponentCard";
// import Label from "@/components/form/Label";
// import Input from "@/components/form/input/InputField";
// import FileInput from "@/components/form/input/FileInput";
// import Button from "@/components/ui/button/Button";
// import Select from "@/components/form/Select";

// // Definisi Opsi Tipe berdasarkan Kategori
// const CATEGORY_TO_TYPES: { [key: string]: { label: string; value: string }[] } = {
//   "Design Interior": [
//     { label: "Enscape", value: "Enscape" },
//     { label: "Kamar", value: "Kamar" },
//     { label: "WC", value: "WC" },
//   ],
//   "Design Eksterior": [
//     { label: "Perumahan", value: "Perumahan" },
//     { label: "Cafe", value: "Cafe" },
//     { label: "Hunian", value: "Hunian" },
//     { label: "Kost", value: "Kost" },
//     { label: "Tempat Ibadah", value: "Tempat Ibadah" },
//     { label: "Villa", value: "Villa" },
//   ],
// };

// function CreatePortofolio() {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [kategori, setKategori] = useState("");
//   const [type, setType] = useState("");

//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const previewRef = useRef<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // Memperoleh opsi tipe secara dinamis berdasarkan kategori yang dipilih
//   const typeOptions = useMemo(() => {
//     return CATEGORY_TO_TYPES[kategori] || [];
//   }, [kategori]);

//   // Handler untuk mengubah Kategori dan mereset Tipe
//   const handleKategoriChange = (val: string | number) => {
//     const newKategori = String(val);
//     setKategori(newKategori);
//     setType(""); // Reset Tipe agar pengguna memilih ulang tipe yang valid
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0] || null;

//     if (file) {
//       setImageFile(file);
//       if (previewRef.current) URL.revokeObjectURL(previewRef.current);
//       const url = URL.createObjectURL(file);
//       previewRef.current = url;
//       setPreviewUrl(url);
//     } else {
//       if (previewRef.current) URL.revokeObjectURL(previewRef.current);
//       previewRef.current = null;
//       setImageFile(null);
//       setPreviewUrl(null);
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (previewRef.current) URL.revokeObjectURL(previewRef.current);
//     };
//   }, []);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     // 1. VALIDASI SISI KLIEN (Untuk Error "wajib diisi")
//     if (!name || !kategori || !type) {
//       // ✅ PERBAIKAN: Ganti alert() dengan pesan yang lebih informatif (jika Anda memiliki komponen modal/toast)
//       console.error("Error: Nama, Kategori, dan Tipe wajib diisi.");
//       alert("Error: Nama, Kategori, dan Tipe wajib diisi.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("description", description);
//     formData.append("kategori", kategori);
//     formData.append("type", type);

//     if (imageFile) formData.append("image", imageFile);

//     setLoading(true);

//     try {
//       const res = await fetch("/api/backend/portofolio", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || "Gagal membuat portofolio");
//       }

//       router.push("/backend/portofolio");
//     } catch (error) {
//       console.error(error);
//       alert((error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Tambah Portofolio" />
//       <ComponentCard title="Form Tambah Portofolio">
//         <form onSubmit={handleSubmit} className="grid gap-4">

//           {/* Input Nama Portofolio */}
//           <div>
//             <Label>Nama Portofolio <span className="text-red-500">*</span></Label>
//             <Input
//               type="text"
//               name="name"
//               required
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Nama portofolio"
//             />
//           </div>

//           {/* Input Deskripsi */}
//           <div>
//             <Label>Deskripsi</Label>
//             <textarea
//               className="w-full rounded-md border border-gray-300 p-2"
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Deskripsi portofolio"
//             />
//           </div>

//           {/* Dropdown Kategori (Kontrol Utama) */}
//           <div>
//             <Label>Kategori <span className="text-red-500">*</span></Label>
//             <Select
//               value={kategori}
//               // ✅ Menggunakan handler baru
//               onChange={handleKategoriChange}
//               placeholder="Pilih Kategori"
//               options={[
//                 { label: "Design Interior", value: "Design Interior" },
//                 { label: "Design Eksterior", value: "Design Eksterior" }
//               ]}
//             />
//           </div>

//           {/* Dropdown Type (Kondisional) */}
//           <div>
//             <Label>Tipe <span className="text-red-500">*</span></Label>
//             <Select
//               value={type}
//               // ✅ PERBAIKAN: Menerima val sebagai string | number, lalu konversi ke String
//               onChange={(val: string | number) => setType(String(val))}
//               placeholder={kategori ? "Pilih Tipe" : "Pilih Kategori Terlebih Dahulu"}
//               // ✅ Menggunakan opsi dinamis
//               options={typeOptions}
//               // ✅ Nonaktifkan jika Kategori belum dipilih
//               disabled={!kategori}
//             />
//           </div>

//           {/* Input Gambar */}
//           <div>
//             <Label>Upload Gambar</Label>
//             <FileInput onChange={handleFileChange} className="custom-class" accept=".png, .webp"/>
//             {previewUrl && (
//               <img
//                 src={previewUrl}
//                 alt="Preview"
//                 className="mt-2 max-h-48 rounded border border-gray-300 object-cover"
//               />
//             )}
//           </div>

//           {/* Tombol Aksi */}
//           <div className="flex justify-end">
//             <Button
//               size="sm"
//               variant="danger"
//               type="button"
//               onClick={() => router.back()}
//               className="mr-2"
//               disabled={loading}
//             >
//               Kembali
//             </Button>

//             <Button size="sm" variant="green" type="submit" disabled={loading}>
//               {loading ? "Menyimpan..." : "Simpan"}
//             </Button>
//           </div>
//         </form>
//       </ComponentCard>
//     </div>
//   );
// }

// export default withPermission(CreatePortofolio, "add-portofolio");

"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { XCircle, Trash2 } from "lucide-react"; // Import ikon untuk hapus

// Definisi Opsi Tipe berdasarkan Kategori
const CATEGORY_TO_TYPES: { [key: string]: { label: string; value: string }[] } = {
  "Design Interior": [
    { label: "Enscape", value: "Enscape" },
    { label: "Kamar", value: "Kamar" },
    { label: "WC", value: "WC" },
  ],
  "Design Eksterior": [
    { label: "Perumahan", value: "Perumahan" },
    { label: "Cafe", value: "Cafe" },
    { label: "Hunian", value: "Hunian" },
    { label: "Kost", value: "Kost" },
    { label: "Tempat Ibadah", value: "Tempat Ibadah" },
    { label: "Villa", value: "Villa" },
  ],
};

// Tipe data untuk File yang di-preview
type PreviewFile = {
    file: File;
    url: string;
    id: number; // ID unik untuk key dan penghapusan
};

// Menggunakan ID Ref untuk menghasilkan ID unik
let fileIdCounter = 0;

function CreatePortofolio() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [kategori, setKategori] = useState("");
  const [type, setType] = useState("");

  // PERUBAHAN UTAMA: Ganti state tunggal menjadi array untuk multiple files
  const [imageFiles, setImageFiles] = useState<PreviewFile[]>([]); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Memperoleh opsi tipe secara dinamis berdasarkan kategori yang dipilih
  const typeOptions = useMemo(() => {
    return CATEGORY_TO_TYPES[kategori] || [];
  }, [kategori]);

  // Handler untuk mengubah Kategori dan mereset Tipe
  const handleKategoriChange = (val: string | number) => {
    const newKategori = String(val);
    setKategori(newKategori);
    setType(""); 
  };

  // PERUBAHAN UTAMA: Handler untuk menambahkan banyak file
  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles: PreviewFile[] = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        newFiles.push({
            file: file,
            url: URL.createObjectURL(file),
            id: fileIdCounter++,
        });
    }

    // Gabungkan file yang baru diupload dengan file yang sudah ada
    setImageFiles(prev => [...prev, ...newFiles]);

    // Reset input file agar pengguna bisa memilih file yang sama lagi jika perlu
    event.target.value = '';
  };

  // PERUBAHAN UTAMA: Handler untuk menghapus file dari preview
  const handleRemoveFile = (id: number) => {
    setImageFiles(prev => {
        const fileToRemove = prev.find(f => f.id === id);
        // Penting: Hapus URL objek untuk membebaskan memori
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.url);
        }
        return prev.filter(f => f.id !== id);
    });
  };


  // Clean up Object URLs saat komponen unmount
  useEffect(() => {
    return () => {
      imageFiles.forEach(file => URL.revokeObjectURL(file.url));
    };
  }, [imageFiles]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. VALIDASI SISI KLIEN
    if (!name || !kategori || !type) {
      alert("Error: Nama, Kategori, dan Tipe wajib diisi.");
      return;
    }

    // PERUBAHAN UTAMA: Validasi minimal satu gambar
    if (imageFiles.length === 0) {
        alert("Error: Minimal harus ada satu Gambar Portofolio yang diunggah.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("kategori", kategori);
    formData.append("type", type);
    
    // PERUBAHAN UTAMA: Lampirkan SEMUA file gambar ke FormData
    imageFiles.forEach((previewFile, index) => {
        // Kami menggunakan key 'images[]' yang akan diinterpretasikan backend sebagai array
        formData.append(`images`, previewFile.file, previewFile.file.name);
    });

    setLoading(true);

    try {
      const res = await fetch("/api/backend/portofolio", {
        method: "POST",
        // Penting: Jangan set header 'Content-Type' secara manual saat menggunakan FormData
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal membuat portofolio");
      }

      router.push("/backend/portofolio");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Portofolio" />
      <ComponentCard title="Form Tambah Portofolio">
        <form onSubmit={handleSubmit} className="grid gap-4">

          {/* Input Nama Portofolio */}
          <div>
            <Label>Nama Portofolio <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama portofolio"
            />
          </div>

          {/* Input Deskripsi */}
          <div>
            <Label>Deskripsi</Label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-2"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi portofolio"
            />
          </div>

          {/* Dropdown Kategori */}
          <div>
            <Label>Kategori <span className="text-red-500">*</span></Label>
            <Select
              value={kategori}
              onChange={handleKategoriChange}
              placeholder="Pilih Kategori"
              options={[
                { label: "Design Interior", value: "Design Interior" },
                { label: "Design Eksterior", value: "Design Eksterior" }
              ]}
            />
          </div>

          {/* Dropdown Type */}
          <div>
            <Label>Tipe <span className="text-red-500">*</span></Label>
            <Select
              value={type}
              onChange={(val: string | number) => setType(String(val))}
              placeholder={kategori ? "Pilih Tipe" : "Pilih Kategori Terlebih Dahulu"}
              options={typeOptions}
              disabled={!kategori}
            />
          </div>

          {/* Input Gambar (Multiple) */}
          <div>
            <Label>Upload Gambar (Multiple) <span className="text-red-500">*</span></Label>
            <FileInput 
              onChange={handleFilesChange} 
              className="custom-class" 
              accept=".png, .webp, .jpg, .jpeg"
              // ✅ Tambahkan atribut multiple
              multiple
            />
            
            {/* Display Preview Gambar */}
            {imageFiles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                    {imageFiles.map((pf) => (
                        <div key={pf.id} className="relative w-40 h-40 border border-gray-300 rounded-lg overflow-hidden group">
                            <img
                                src={pf.url}
                                alt={`Preview ${pf.file.name}`}
                                className="w-full h-full object-cover"
                            />
                            {/* Tombol Hapus */}
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(pf.id)}
                                className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Hapus ${pf.file.name}`}
                            >
                                <Trash2 size={16} />
                            </button>
                            {/* Overlay Nama File */}
                            <div className="absolute bottom-0 w-full p-1 bg-black/50 text-white text-xs text-center truncate">
                                {pf.file.name}
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Tombol Aksi */}
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

export default withPermission(CreatePortofolio, "add-portofolio");