"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";

type CompressedFile = {
  name: string;
  originalSize: number;
  compressedSize: number;
  blob: Blob;
};

export default function ImageCompressorPage() {
  const [files, setFiles] = useState<CompressedFile[]>([]);

  const compressImage = (file: File, maxWidth = 1920, quality = 0.7) => {
    return new Promise<Blob>((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const scale = Math.min(maxWidth / img.width, 1);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => blob && resolve(blob),
          "image/jpeg",
          quality
        );
      };
    });
  };

  const LOGO_URL = "/bless_logo.png"; // <-- GANTI dengan path logo Anda

  const addWatermark = (blob: Blob, logoUrl: string = LOGO_URL) => {
    return new Promise<Blob>((resolve) => {
      const imageToWatermark = new Image();
      imageToWatermark.src = URL.createObjectURL(blob);

      imageToWatermark.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = imageToWatermark.width;
        canvas.height = imageToWatermark.height;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(imageToWatermark, 0, 0);

        const logo = new Image();
        logo.src = logoUrl;
        logo.crossOrigin = "anonymous";

        logo.onload = () => {
          // ==== FIXED SIZE ====
          const baseWidth = 1920;
          const targetSize = 210; // sesuaikan ukuran
          const scale = canvas.width / baseWidth;
          const wmWidth = targetSize * scale;
          const wmHeight = wmWidth * (logo.height / logo.width);

          // ==== POSISI KANAN BAWAH ====
          const padding = 40;
          const x = canvas.width - wmWidth - padding;
          const y = canvas.height - wmHeight - padding;

          // Transparansi
          ctx.globalAlpha = 0.9;

          ctx.drawImage(logo, x, y, wmWidth, wmHeight);

          ctx.globalAlpha = 1.0;

          canvas.toBlob(
            (watermarkedBlob) => {
              if (watermarkedBlob) resolve(watermarkedBlob);
            },
            "image/jpeg",
            0.9
          );
        };
      };
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const compressedFiles: CompressedFile[] = [];

    for (const file of acceptedFiles) {
      const compressed = await compressImage(file);

      compressedFiles.push({
        name: file.name,
        originalSize: file.size,
        compressedSize: compressed.size,
        blob: compressed,
      });
    }

    setFiles(compressedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  // ⬇️ download hasil watermark, bukan blob asli
  const downloadFile = async (file: CompressedFile) => {
    const watermarked = await addWatermark(file.blob);
    saveAs(watermarked, `WM-${file.name}`);
  };

  const downloadAll = async () => {
    for (const f of files) {
      const wm = await addWatermark(f.blob);
      saveAs(wm, `WM-${f.name}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold text-center mb-6">Image Compressor + Watermark</h1>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center mx-auto max-w-3xl cursor-pointer ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600">Drop the files here...</p>
        ) : (
          <p>Drag & drop images here, or click to select files</p>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-6 max-w-3xl mx-auto">
          {files.map((file, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-3"
            >
              <div>
                <p className="font-semibold">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {Math.round(file.originalSize / 1024)} KB →{" "}
                  {Math.round(file.compressedSize / 1024)} KB
                </p>
              </div>

              <button
                onClick={() => downloadFile(file)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Download + WM
              </button>
            </motion.div>
          ))}

          {files.length > 1 && (
            <button
              onClick={downloadAll}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Download All + WM
            </button>
          )}
        </div>
      )}
    </div>
  );
}
