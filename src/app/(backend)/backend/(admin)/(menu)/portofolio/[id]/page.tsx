// "use client";

// import React, { useEffect, useState, useMemo, useRef } from "react";
// import withPermission from "@/components/auth/withPermission";
// import { useRouter, useParams } from "next/navigation";
// import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import ComponentCard from "@/components/common/ComponentCard";
// import Label from "@/components/form/Label";
// import Input from "@/components/form/input/InputField";
// import Button from "@/components/ui/button/Button";
// import SkeletonDefault from "@/components/skeleton/Default";
// import FileInput from "@/components/form/input/FileInput";
// import Select from "@/components/form/Select";
// import { Trash2 } from "lucide-react"; // Import ikon hapus

// // Definisi Opsi Tipe berdasarkan Kategori (Tetap Sama)
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

// // Tipe data untuk Gambar yang sudah ada (existing)
// type ExistingImage = {
//     id: number;
//     url: string;
// };

// // Tipe data untuk Gambar baru (new) - menggunakan id sementara untuk manajemen UI
// type NewImage = {
//     id: number; // ID lokal sementara
//     file: File;
//     url: string;
// };

// let fileIdCounter = 0; // Counter untuk ID sementara gambar baru

// function EditPortofolio() {
//   const router = useRouter();
//   const params = useParams<{ id: string }>();

//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [kategori, setKategori] = useState("");
//   const [type, setType] = useState("");
  
//   // PERUBAHAN UTAMA 1: State untuk mengelola gambar
//   // Gambar yang sudah ada di database
//   const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
//   // Gambar baru yang baru diupload via input file
//   const [newImageFiles, setNewImageFiles] = useState<NewImage[]>([]);
//   // ID gambar dari existingImages yang ditandai untuk dihapus
//   const [imagesToDelete, setImagesToDelete] = useState<number[]>([]); 

//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);

//   // Memperoleh opsi tipe secara dinamis
//   const typeOptions = useMemo(() => {
//     return CATEGORY_TO_TYPES[kategori] || [];
//   }, [kategori]);

//   // Handler untuk mengubah Kategori
//   const handleKategoriChange = (val: string | number) => {
//     const newKategori = String(val);
//     setKategori(newKategori);
//     // Hanya reset Tipe jika kategori yang dipilih adalah yang baru
//     if (typeOptions.length > 0 && !typeOptions.some(opt => opt.value === type)) {
//         setType(""); 
//     }
//   };

//   // PERUBAHAN UTAMA 2: Fetch data dengan semua gambar
//   useEffect(() => {
//     document.title = "Edit Portofolio | Admin Panel";

//     async function fetchPortofolio() {
//       if (!params.id) return;

//       try {
//         const res = await fetch(`/api/backend/portofolio/${params.id}`);
//         if (!res.ok) throw new Error("Gagal memuat portofolio");

//         const data = await res.json();
//         setName(data.name || "");
//         setDescription(data.description || "");
//         setKategori(data.kategori || "");
//         setType(data.type || ""); 
        
//         // 🔥 Mengisi state gambar yang sudah ada
//         // Menggunakan portofolio_images sesuai dengan perbaikan di backend
//         setExistingImages(data.portofolio_images || []); 

//       } catch (error) {
//         console.error(error);
//         alert("Gagal memuat data portofolio");
//       } finally {
//         setInitialLoading(false);
//       }
//     }

//     fetchPortofolio();

//     // Cleanup: Cabut URL objek saat komponen unmount atau dependencies berubah
//     return () => {
//         newImageFiles.forEach(img => URL.revokeObjectURL(img.url));
//     };
//   }, [params.id]);


//   // Handler untuk file baru (Multiple File Input)
//   const handleNewFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (!files || files.length === 0) return;

//     const newFilesArray: NewImage[] = [];
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         newFilesArray.push({
//             id: fileIdCounter++,
//             file: file,
//             url: URL.createObjectURL(file),
//         });
//     }

//     setNewImageFiles(prev => [...prev, ...newFilesArray]);
//     event.target.value = ''; // Reset input file
//   };

//   // Handler untuk menghapus gambar yang baru diupload (sebelum disimpan)
//   const handleRemoveNewFile = (id: number) => {
//     setNewImageFiles(prev => {
//         const fileToRemove = prev.find(f => f.id === id);
//         if (fileToRemove) URL.revokeObjectURL(fileToRemove.url);
//         return prev.filter(f => f.id !== id);
//     });
//   };

//   // Handler untuk menandai gambar yang sudah ada agar dihapus
//   const handleMarkExistingForDelete = (id: number) => {
//     // Pindahkan ID gambar dari existingImages ke imagesToDelete
//     setExistingImages(prev => prev.filter(img => img.id !== id));
//     setImagesToDelete(prev => [...prev, id]);
//   };
  
//   // PERUBAHAN UTAMA 3: Update Logika Submit
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     // 1. VALIDASI
//     if (!name || !kategori || !type) {
//         alert("Error: Nama, Kategori, dan Tipe wajib diisi.");
//         return; 
//     }
    
//     // Validasi minimal 1 gambar (baru + lama - yang dihapus)
//     if (existingImages.length + newImageFiles.length === 0) {
//         alert("Error: Portofolio harus memiliki minimal satu gambar.");
//         return; 
//     }

//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("name", name);
//       formData.append("description", description);
//       formData.append("kategori", kategori);
//       formData.append("type", type);
      
//       // ✅ 1. Lampirkan ID gambar yang akan dihapus
//       formData.append("images_to_delete", JSON.stringify(imagesToDelete));

//       // ✅ 2. Lampirkan SEMUA file gambar baru
//       newImageFiles.forEach((newImage) => {
//         // Gunakan key 'new_images' (atau 'images') yang disepakati dengan backend
//         formData.append("new_images", newImage.file, newImage.file.name);
//       });

//       const res = await fetch(`/api/backend/portofolio/${params.id}`, {
//         // Menggunakan PATCH lebih akurat untuk update parsial
//         method: "PATCH", 
//         body: formData,
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.error || "Gagal update portofolio");
//       }

//       router.push("/backend/portofolio");
//     } catch (error) {
//       console.error(error);
//       alert((error as Error).message || "Terjadi kesalahan saat update portofolio");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Gabungan semua gambar untuk ditampilkan di UI
//   const allCurrentImages = [...existingImages, ...newImageFiles];

//   if (initialLoading) {
//     return (
//       <>
//         <PageBreadcrumb pageTitle="Data Portofolio" />
//         <ComponentCard title="Form Edit Portofolio">
//           <SkeletonDefault />
//         </ComponentCard>
//       </>
//     );
//   }

//   return (
//     <div>
//       <PageBreadcrumb pageTitle="Edit Portofolio" />
//       <ComponentCard title="Form Edit Portofolio">
//         <form onSubmit={handleSubmit} className="grid gap-4">
          
//           {/* Input Nama Portofolio */}
//           <div>
//             <Label>Nama Portofolio <span className="text-red-500">*</span></Label>
//             <Input
//               type="text"
//               value={name}
//               required
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Input Nama Portofolio"
//               disabled={loading}
//             />
//           </div>

//           {/* Input Deskripsi */}
//           <div>
//             <Label>Deskripsi</Label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full rounded-md border border-gray-300 p-2"
//               rows={4}
//               disabled={loading}
//               placeholder="Deskripsi portofolio"
//             />
//           </div>

//           {/* Dropdown Kategori */}
//           <div>
//             <Label>Kategori <span className="text-red-500">*</span></Label>
//             <Select
//               value={kategori}
//               onChange={handleKategoriChange}
//               placeholder="Pilih Kategori"
//               options={[
//                 { label: "Design Interior", value: "Design Interior" },
//                 { label: "Design Eksterior", value: "Design Eksterior" }
//               ]}
//               disabled={loading}
//             />
//           </div>

//           {/* Dropdown Type */}
//           <div>
//             <Label>Tipe <span className="text-red-500">*</span></Label>
//             <Select
//               value={type}
//               onChange={(val: string | number) => setType(String(val))}
//               placeholder={kategori ? "Pilih Tipe" : "Pilih Kategori Terlebih Dahulu"}
//               options={typeOptions}
//               disabled={loading || !kategori}
//             />
//           </div>

//           {/* Bagian Manajemen Gambar */}
//           <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
//             <h3 className="text-lg font-semibold mb-3">Manajemen Gambar Portofolio</h3>

//             {/* Input Gambar Baru */}
//             <div>
//               <Label>Tambah Gambar Baru</Label>
//               <FileInput 
//                 onChange={handleNewFilesChange} 
//                 disabled={loading} 
//                 accept=".png, .webp, .jpg, .jpeg"
//                 multiple
//               />
//             </div>
            
//             {/* Display Semua Gambar (Existing + New) */}
//             {allCurrentImages.length > 0 && (
//                 <div className="mt-4">
//                     <Label>Gambar Saat Ini ({allCurrentImages.length} file)</Label>
//                     <div className="flex flex-wrap gap-4 mt-2">
//                         {allCurrentImages.map((img) => (
//                             <div 
//                                 key={('file' in img) ? `new-${img.id}` : `old-${img.id}`} 
//                                 className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden group"
//                             >
//                                 <img
//                                     src={img.url}
//                                     alt="Portofolio Image"
//                                     className="w-full h-full object-cover"
//                                 />
//                                 {/* Tombol Hapus */}
//                                 <button
//                                     type="button"
//                                     onClick={() => {
//                                         if ('file' in img) {
//                                             handleRemoveNewFile(img.id); // Hapus gambar baru
//                                         } else {
//                                             handleMarkExistingForDelete(img.id); // Tandai gambar lama untuk dihapus
//                                         }
//                                     }}
//                                     className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
//                                     aria-label="Hapus Gambar"
//                                 >
//                                     <Trash2 size={16} />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
//             {allCurrentImages.length === 0 && (
//                 <p className="text-red-500 mt-2 text-sm">Portofolio ini tidak memiliki gambar. Harap tambahkan setidaknya satu.</p>
//             )}
//           </div>

//           {/* Tombol Aksi */}
//           <div className="flex justify-end mt-4">
//             <Button
//               size="sm"
//               className="mr-2"
//               variant="danger"
//               type="button"
//               onClick={() => router.back()}
//               disabled={loading}
//             >
//               Kembali
//             </Button>

//             <Button size="sm" variant="green" type="submit" disabled={loading}>
//               {loading ? "Menyimpan..." : "Simpan Perubahan"}
//             </Button>
//           </div>
//         </form>
//       </ComponentCard>
//     </div>
//   );
// }

// export default withPermission(EditPortofolio, "edit-portofolio");

"use client";

import React, { useState, useEffect } from "react";
import withPermission from "@/components/auth/withPermission";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { Trash2 } from "lucide-react";

type PreviewFile = {
  file: File;
  url: string;
  id: number;
};

type OldImage = {
  id: number;
  url: string;
};

let fileIdCounter = 0;

function EditPortofolio() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [oldImages, setOldImages] = useState<OldImage[]>([]);
  const [deletedImages, setDeletedImages] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<PreviewFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const res = await fetch(`/api/backend/portofolio/${id}`);
        if (!res.ok) throw new Error("Gagal memuat data portofolio");

        const data = await res.json();
        if (!data) return;

        setName(data.name || "");
        setDescription(data.description || "");
        setType(data.type || "");

        if (data.portofolio_images) {
          setOldImages(
            data.portofolio_images.map((img: OldImage) => ({
              id: img.id,
              url: img.url,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading portofolio data:", err);
        alert("Gagal memuat data portofolio.");
      }
    }

    loadData();
  }, [id]);

  useEffect(() => {
    return () => {
      newImages.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [newImages]);

  const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const fileArr = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: fileIdCounter++,
    }));

    setNewImages((prev) => [...prev, ...fileArr]);
    event.target.value = "";
  };

  const removeNewImage = (id: number) => {
    setNewImages((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.url);
      return prev.filter((f) => f.id !== id);
    });
  };

  const removeOldImage = (id: number) => {
    setDeletedImages((prev) => [...prev, id]);
    setOldImages((prev) => prev.filter((img) => img.id !== id));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (oldImages.length + newImages.length === 0) {
      alert("Portofolio harus memiliki minimal satu gambar.");
      return;
    }

    if (!name || !type) {
      alert("Nama & Tipe wajib diisi.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", type);

    if (deletedImages.length > 0) {
      formData.append("images_to_delete", JSON.stringify(deletedImages));
    }

    newImages.forEach((pf) => {
      formData.append("new_images", pf.file);
    });

    setLoading(true);

    try {
      const res = await fetch(`/api/backend/portofolio/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal update portofolio");
      }

      router.push("/backend/portofolio");
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Portofolio" />

      <ComponentCard title="Edit Portofolio">
        {/* 🔥 Tambah spacing default antar field */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <Label>
              Nama Portofolio <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Deskripsi</Label>
            <textarea
              className="w-full border p-2 rounded"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* TYPE */}
          <div>
            <Label>
              Tipe <span className="text-red-500">*</span>
            </Label>
            <Select
              value={type}
              onChange={(val: string | number) => setType(String(val))}
              options={[
                { label: "Arsitek", value: "arsitek" },
                { label: "Kontraktor", value: "kontraktor" },
                { label: "Interior & Furtinur", value: "furnitur" },
                { label: "Animasi", value: "animasi" },
                { label: "Komersial", value: "komersial" },
              ]}
            />
          </div>

          {/* OLD IMAGES */}
          <div>
            <Label>Gambar Lama (Klik untuk Hapus)</Label>

            {oldImages.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {oldImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-40 h-40 border rounded overflow-hidden group"
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover"
                      alt={`Gambar lama ${img.id}`}
                    />

                    <button
                      type="button"
                      onClick={() => removeOldImage(img.id)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Tidak ada gambar lama.</p>
            )}
          </div>

          {/* NEW IMAGES UPLOAD */}
          <div>
            <Label>Upload Gambar Baru</Label>
            <FileInput multiple onChange={handleFilesChange} />

            {newImages.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {newImages.map((pf) => (
                  <div
                    key={pf.id}
                    className="relative w-40 h-40 border rounded overflow-hidden group"
                  >
                    <img
                      src={pf.url}
                      className="w-full h-full object-cover"
                      alt={`Gambar baru ${pf.file.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(pf.id)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="absolute bottom-0 bg-black/40 text-white text-xs p-1 text-center w-full truncate">
                      {pf.file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="danger"
              className="mr-2"
              onClick={() => router.back()}
            >
              Kembali
            </Button>

            <Button type="submit" variant="green" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

export default withPermission(EditPortofolio, "edit-portofolio");
