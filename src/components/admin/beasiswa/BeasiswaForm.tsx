
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiSave,
  FiArrowLeft,
  FiUploadCloud,
  FiX,
  FiLoader,
  FiImage,
  FiCalendar,
  FiLink,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import {
  createBeasiswa,
  updateBeasiswa,
  type Beasiswa,
} from "@/lib/beasiswa";

import { uploadToCloudinary } from "@/lib/cloudinary";

interface BeasiswaFormProps {
  initialData?: Beasiswa;
  mode: "create" | "edit";
}

const inputClass =
  "w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/10";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#1F4B3B]";

export default function BeasiswaForm({
  initialData,
  mode,
}: BeasiswaFormProps) {
  const router = useRouter();

  // Form states
  const [judul, setJudul] = useState("");
  const [penyelenggara, setPenyelenggara] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [persyaratan, setPersyaratan] = useState("");
  const [manfaat, setManfaat] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [linkPendaftaran, setLinkPendaftaran] = useState("");
  const [status, setStatus] = useState<
    "draft" | "aktif" | "ditutup"
  >("draft");

  // Image states
  const [gambar, setGambar] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // Process states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mengisi form ketika mode edit
  useEffect(() => {
    if (!initialData) return;

    setJudul(initialData.judul || "");
    setPenyelenggara(initialData.penyelenggara || "");
    setDeskripsi(initialData.deskripsi || "");
    setPersyaratan(initialData.persyaratan || "");
    setManfaat(initialData.manfaat || "");
    setTanggalMulai(initialData.tanggalMulai || "");
    setTanggalSelesai(initialData.tanggalSelesai || "");
    setLinkPendaftaran(initialData.linkPendaftaran || "");
    setStatus(initialData.status || "draft");
    setGambar(initialData.gambar || "");
    setPreview(initialData.gambar || "");
  }, [initialData]);

  // Membersihkan object URL saat komponen dilepas
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Menampilkan pesan error Firebase yang sebenarnya
  const getErrorMessage = (err: unknown): string => {
    const firebaseError = err as {
      code?: string;
      message?: string;
    };

    if (firebaseError?.code === "permission-denied") {
      return (
        "Firestore menolak akses. Pastikan akun admin yang login adalah " +
        "aksalera26@gmail.com, email sudah terverifikasi, dan Rules " +
        "sudah dipublikasikan pada proyek Firebase yang benar."
      );
    }

    if (firebaseError?.code === "unauthenticated") {
      return "Sesi login tidak ditemukan. Silakan logout dan login kembali.";
    }

    if (firebaseError?.code === "failed-precondition") {
      return "Operasi Firestore belum memenuhi persyaratan. Periksa indeks Firestore atau konfigurasi database.";
    }

    return firebaseError?.message || "Terjadi kesalahan yang tidak diketahui.";
  };

  // Memilih gambar poster
  const handleImageChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    setError("");
    setSuccess("");

    if (!selectedFile.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Format gambar harus JPG, PNG, atau WebP.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Menghapus poster
  const handleRemoveImage = () => {
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setGambar("");
    setPreview("");
    setError("");
  };

  // Menyimpan data
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!judul.trim()) {
      setError("Judul beasiswa wajib diisi.");
      return;
    }

    if (!penyelenggara.trim()) {
      setError("Nama penyelenggara wajib diisi.");
      return;
    }

    if (!deskripsi.trim()) {
      setError("Deskripsi beasiswa wajib diisi.");
      return;
    }

    if (!tanggalMulai || !tanggalSelesai) {
      setError("Tanggal mulai dan tanggal selesai wajib diisi.");
      return;
    }

    if (tanggalSelesai < tanggalMulai) {
      setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }

    if (!gambar && !file) {
      setError("Poster beasiswa wajib diunggah.");
      return;
    }

    if (
      linkPendaftaran.trim() &&
      !/^https?:\/\/.+/i.test(linkPendaftaran.trim())
    ) {
      setError("Link pendaftaran harus diawali http:// atau https://.");
      return;
    }

    if (mode === "edit" && !initialData?.id) {
      setError("ID beasiswa tidak ditemukan.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = gambar;

      // Upload poster baru ke Cloudinary
      if (file) {
        setUploading(true);
        imageUrl = await uploadToCloudinary(file);
        setUploading(false);
      }

      const payload = {
        judul: judul.trim(),
        penyelenggara: penyelenggara.trim(),
        deskripsi: deskripsi.trim(),
        persyaratan: persyaratan.trim(),
        manfaat: manfaat.trim(),
        tanggalMulai,
        tanggalSelesai,
        linkPendaftaran: linkPendaftaran.trim(),
        gambar: imageUrl,
        status,
      };

      if (mode === "create") {
        await createBeasiswa(payload);
      } else {
        await updateBeasiswa(initialData!.id, payload);
      }

      setSuccess("Data beasiswa berhasil disimpan.");

      router.push("/admin/informasi/beasiswa");
      router.refresh();
    } catch (err) {
      console.error("BEASISWA ERROR:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl min-w-0 space-y-5 pb-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-gray-400">
            <Link
              href="/admin/informasi/beasiswa"
              className="transition hover:text-[#1F4B3B]"
            >
              Informasi
            </Link>
            <span>/</span>
            <span className="text-[#1F4B3B]">Beasiswa</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#1F4B3B] sm:text-3xl">
            {mode === "create"
              ? "Tambah Beasiswa"
              : "Edit Beasiswa"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola informasi beasiswa untuk mahasiswa.
          </p>
        </div>

        <Link
          href="/admin/informasi/beasiswa"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          <FiArrowLeft size={16} />
          Kembali
        </Link>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* INFORMASI UTAMA */}
        <section className="overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white shadow-sm">
          <div className="border-b border-[#E8EDE9] bg-[#FAFBF9] px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F4B3B]/10 text-[#1F4B3B]">
                <FiFileText size={19} />
              </div>
              <div>
                <h2 className="font-bold text-[#1F4B3B]">
                  Informasi Utama
                </h2>
                <p className="text-xs text-gray-500">
                  Informasi dasar program beasiswa
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-4 sm:p-6">
            <div>
              <label className={labelClass}>
                Judul Beasiswa *
              </label>
              <input
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
                maxLength={150}
                placeholder="Contoh: Beasiswa Unggulan 2027"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Penyelenggara *
              </label>
              <input
                value={penyelenggara}
                onChange={(e) => setPenyelenggara(e.target.value)}
                required
                maxLength={150}
                placeholder="Nama lembaga penyelenggara"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>
                Deskripsi Beasiswa *
              </label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
                rows={5}
                placeholder="Jelaskan informasi lengkap mengenai beasiswa..."
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </section>

        {/* DETAIL BEASISWA */}
        <section className="overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white shadow-sm">
          <div className="border-b border-[#E8EDE9] bg-[#FAFBF9] px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F4B3B]/10 text-[#1F4B3B]">
                <FiCalendar size={19} />
              </div>
              <div>
                <h2 className="font-bold text-[#1F4B3B]">
                  Detail Beasiswa
                </h2>
                <p className="text-xs text-gray-500">
                  Persyaratan, manfaat, dan periode pendaftaran
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            <div>
              <label className={labelClass}>
                Persyaratan
              </label>
              <textarea
                value={persyaratan}
                onChange={(e) => setPersyaratan(e.target.value)}
                rows={5}
                placeholder="Masukkan persyaratan, satu poin per baris..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label className={labelClass}>
                Manfaat Beasiswa
              </label>
              <textarea
                value={manfaat}
                onChange={(e) => setManfaat(e.target.value)}
                rows={4}
                placeholder="Jelaskan manfaat yang diperoleh penerima beasiswa..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="min-w-0">
                <label className={labelClass}>
                  Tanggal Mulai *
                </label>
                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div className="min-w-0">
                <label className={labelClass}>
                  Tanggal Selesai *
                </label>
                <input
                  type="date"
                  value={tanggalSelesai}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  required
                  min={tanggalMulai || undefined}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Link Pendaftaran
              </label>

              <div className="relative">
                <FiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={linkPendaftaran}
                  onChange={(e) => setLinkPendaftaran(e.target.value)}
                  placeholder="https://contoh.com/pendaftaran"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* POSTER */}
        <section className="overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white shadow-sm">
          <div className="border-b border-[#E8EDE9] bg-[#FAFBF9] px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F4B3B]/10 text-[#1F4B3B]">
                <FiImage size={19} />
              </div>
              <div>
                <h2 className="font-bold text-[#1F4B3B]">
                  Poster Beasiswa
                </h2>
                <p className="text-xs text-gray-500">
                  Upload gambar untuk informasi beasiswa
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-[#FAFBF9] p-4 text-center transition hover:border-[#1F4B3B] hover:bg-[#F4EED9]/30 sm:min-h-64">
              {preview ? (
                <div className="w-full">
                  <img
                    src={preview}
                    alt="Preview poster beasiswa"
                    className="mx-auto max-h-72 max-w-full rounded-xl object-contain"
                  />
                  <p className="mt-4 text-sm font-semibold text-[#1F4B3B]">
                    Klik untuk mengganti poster
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1F4B3B]/10 text-[#1F4B3B]">
                    <FiUploadCloud size={30} />
                  </div>
                  <p className="mt-4 text-sm font-bold text-[#1F4B3B]">
                    Pilih gambar poster
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    JPG, PNG, atau WebP
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Ukuran maksimal 5 MB
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  handleImageChange(e.target.files?.[0] || null);
                  e.currentTarget.value = "";
                }}
              />
            </label>

            {preview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-3 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <FiX size={16} />
                Hapus poster
              </button>
            )}
          </div>
        </section>

        {/* STATUS */}
        <section className="overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white shadow-sm">
          <div className="border-b border-[#E8EDE9] bg-[#FAFBF9] px-4 py-4 sm:px-6">
            <h2 className="font-bold text-[#1F4B3B]">
              Status Publikasi
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Atur status penayangan informasi beasiswa
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <label className={labelClass}>
              Pilih Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as "draft" | "aktif" | "ditutup"
                )
              }
              className={inputClass}
            >
              <option value="draft">Draft</option>
              <option value="aktif">Aktif / Dipublikasikan</option>
              <option value="ditutup">Ditutup</option>
            </select>

            <p className="mt-2 text-xs leading-relaxed text-gray-400">
              Draft digunakan untuk menyimpan informasi yang belum
              siap dipublikasikan. Status aktif dan ditutup dapat
              digunakan untuk mengatur informasi beasiswa.
            </p>
          </div>
        </section>

        {/* PESAN ERROR */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <FiAlertCircle className="mt-0.5 shrink-0" size={19} />
            <div className="min-w-0">
              <p className="font-bold">Gagal menyimpan data</p>
              <p className="mt-1 break-words leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <FiCheckCircle className="mt-0.5 shrink-0" size={19} />
            {success}
          </div>
        )}

        {/* TOMBOL AKSI */}
        <div className="sticky bottom-0 z-10 -mx-3 border-t border-gray-100 bg-white/95 p-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/informasi/beasiswa"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 sm:w-auto"
            >
              <FiArrowLeft size={17} />
              Kembali
            </Link>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17392D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={17} />
                  {uploading
                    ? "Mengunggah poster..."
                    : "Menyimpan data..."}
                </>
              ) : (
                <>
                  <FiSave size={17} />
                  {mode === "create"
                    ? "Simpan Beasiswa"
                    : "Simpan Perubahan"}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
