
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiSave, FiUpload, FiX } from "react-icons/fi";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  createPengumuman,
  updatePengumuman,
  type Pengumuman,
  type PengumumanInput,
  type StatusPengumuman,
} from "@/lib/pengumuman";

interface Props {
  initialData?: Pengumuman;
  mode: "create" | "edit";
}

export default function PengumumanForm({
  initialData,
  mode,
}: Props) {
  const router = useRouter();

  const [judul, setJudul] = useState(initialData?.judul ?? "");
  const [isi, setIsi] = useState(initialData?.isi ?? "");
  const [tanggalPublikasi, setTanggalPublikasi] = useState(
    initialData?.tanggalPublikasi ??
      new Date().toISOString().slice(0, 10)
  );
  const [linkTerkait, setLinkTerkait] = useState(
    initialData?.linkTerkait ?? ""
  );
  const [status, setStatus] = useState<StatusPengumuman>(
    initialData?.status ?? "draft"
  );
  const [gambar, setGambar] = useState(initialData?.gambar ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Format gambar harus JPG, PNG, atau WEBP.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setError("");
    setFile(selectedFile);
    setGambar(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!judul.trim() || !isi.trim() || !tanggalPublikasi) {
      setError("Judul, isi, dan tanggal publikasi wajib diisi.");
      return;
    }

    if (linkTerkait.trim()) {
      try {
        const url = new URL(linkTerkait);
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error();
        }
      } catch {
        setError("Link terkait harus berupa URL yang valid.");
        return;
      }
    }

    setLoading(true);

    try {
      let imageUrl = initialData?.gambar ?? "";

      if (file) {
        imageUrl = await uploadToCloudinary(
          file,
          "aksaleraverse/informasi/pengumuman"
        );
      }

      const data: PengumumanInput = {
        judul: judul.trim(),
        isi: isi.trim(),
        tanggalPublikasi,
        linkTerkait: linkTerkait.trim(),
        gambar: imageUrl,
        status,
      };

      if (mode === "create") {
        await createPengumuman(data);
      } else if (initialData?.id) {
        await updatePengumuman(initialData.id, data);
      }

      router.push("/admin/informasi/pengumuman");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan pengumuman."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <h2 className="mb-6 text-lg font-bold text-[#1F4B3B]">
          Informasi Pengumuman
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Judul Pengumuman <span className="text-red-500">*</span>
            </label>
            <input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Masukkan judul pengumuman"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#1F4B3B] focus:ring-2 focus:ring-[#1F4B3B]/10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Isi Pengumuman <span className="text-red-500">*</span>
            </label>
            <textarea
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              placeholder="Tuliskan isi pengumuman secara lengkap..."
              rows={8}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4B3B] focus:ring-2 focus:ring-[#1F4B3B]/10"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Tanggal Publikasi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={tanggalPublikasi}
                onChange={(e) => setTanggalPublikasi(e.target.value)}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as StatusPengumuman)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
              >
                <option value="draft">Draft</option>
                <option value="aktif">Aktif</option>
                <option value="ditutup">Ditutup</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Link Terkait
            </label>
            <input
              type="url"
              value={linkTerkait}
              onChange={(e) => setLinkTerkait(e.target.value)}
              placeholder="https://contoh.com (opsional)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <h2 className="mb-2 text-lg font-bold text-[#1F4B3B]">
          Gambar Pengumuman
        </h2>
        <p className="mb-5 text-sm text-gray-500">
          Gambar bersifat opsional. Format JPG, PNG, atau WEBP, maksimal 5 MB.
        </p>

        {gambar ? (
          <div className="relative max-w-md overflow-hidden rounded-xl border border-gray-200">
            <Image
              src={gambar}
              alt="Preview gambar pengumuman"
              width={800}
              height={450}
              unoptimized
              className="h-auto max-h-64 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => {
                setGambar("");
                setFile(null);
              }}
              className="absolute right-3 top-3 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
              aria-label="Hapus gambar"
            >
              <FiX />
            </button>
          </div>
        ) : (
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-[#1F4B3B] hover:bg-[#F4EED9]/40">
            <FiUpload className="mb-3 text-3xl text-[#1F4B3B]" />
            <span className="text-sm font-semibold text-gray-700">
              Klik untuk mengunggah gambar
            </span>
            <span className="mt-1 text-xs text-gray-500">
              JPG, PNG, WEBP (maksimal 5 MB)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) =>
                handleFileChange(e.target.files?.[0] ?? null)
              }
            />
          </label>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#17392D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiSave />
          {loading ? "Menyimpan..." : "Simpan Pengumuman"}
        </button>
      </div>
    </form>
  );
}
