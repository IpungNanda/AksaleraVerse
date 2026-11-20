
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
  FiBriefcase,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";

import {
  createMagang,
  updateMagang,
  type Magang,
} from "@/lib/magang";

import { uploadToCloudinary } from "@/lib/cloudinary";

interface MagangFormProps {
  initialData?: Magang;
  mode: "create" | "edit";
}

const inputClass =
  "w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/10";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#1F4B3B]";

export default function MagangForm({
  initialData,
  mode,
}: MagangFormProps) {
  const router = useRouter();

  // FORM DATA
  const [judul, setJudul] = useState("");
  const [penyelenggara, setPenyelenggara] = useState("");
  const [posisi, setPosisi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [persyaratan, setPersyaratan] = useState("");
  const [manfaat, setManfaat] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [linkPendaftaran, setLinkPendaftaran] = useState("");

  const [status, setStatus] = useState<
    "draft" | "aktif" | "ditutup"
  >("draft");

  // POSTER
  const [gambar, setGambar] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // STATUS
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // ISI DATA SAAT EDIT
  useEffect(() => {
    if (!initialData) return;

    setJudul(initialData.judul || "");
    setPenyelenggara(initialData.penyelenggara || "");
    setPosisi(initialData.posisi || "");
    setLokasi(initialData.lokasi || "");
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

  // MEMBERSIHKAN PREVIEW SEMENTARA
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // PILIH POSTER
  const handleImageChange = (selectedFile: File | null) => {
    if (!selectedFile) return;

    setError("");

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
      setError("Ukuran poster maksimal 5 MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // HAPUS POSTER
  const handleRemoveImage = () => {
    if (preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setGambar("");
    setPreview("");
  };

  // PESAN ERROR
  const getErrorMessage = (err: unknown) => {
    const firebaseError = err as {
      code?: string;
      message?: string;
    };

    if (firebaseError?.code === "permission-denied") {
      return "Akses Firestore ditolak. Periksa login admin dan Firestore Rules.";
    }

    if (firebaseError?.code === "unauthenticated") {
      return "Sesi login tidak ditemukan. Silakan login kembali.";
    }

    return firebaseError?.message || "Gagal menyimpan informasi Magang.";
  };

  // SIMPAN DATA
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !judul.trim() ||
      !penyelenggara.trim() ||
      !posisi.trim() ||
      !lokasi.trim() ||
      !deskripsi.trim()
    ) {
      setError("Lengkapi seluruh informasi wajib terlebih dahulu.");
      return;
    }

    if (!tanggalMulai || !tanggalSelesai) {
      setError("Tanggal mulai dan selesai wajib diisi.");
      return;
    }

    if (tanggalSelesai < tanggalMulai) {
      setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }

    if (!gambar && !file) {
      setError("Poster Magang wajib diunggah.");
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
      setError("ID Magang tidak ditemukan.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = gambar;

      if (file) {
        setUploading(true);
        imageUrl = await uploadToCloudinary(file);
        setUploading(false);
      }

      const payload = {
        judul: judul.trim(),
        penyelenggara: penyelenggara.trim(),
        posisi: posisi.trim(),
        lokasi: lokasi.trim(),
        deskripsi: deskripsi.trim(),
        persyaratan: persyaratan.trim(),
        manfaat: manfaat.trim(),
        tanggalMulai,
        tanggalSelesai,
        gambar: imageUrl,
        linkPendaftaran: linkPendaftaran.trim(),
        status,
      };

      if (mode === "create") {
        await createMagang(payload);
      } else {
        await updateMagang(initialData!.id, payload);
      }

      router.push("/admin/informasi/magang");
      router.refresh();
    } catch (err) {
      console.error("MAGANG FORM ERROR:", err);
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
              href="/admin/informasi/magang"
              className="hover:text-[#1F4B3B]"
            >
              Informasi
            </Link>
            <span>/</span>
            <span className="text-[#1F4B3B]">Magang</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#1F4B3B] sm:text-3xl">
            {mode === "create" ? "Tambah Magang" : "Edit Magang"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola informasi lowongan dan program magang.
          </p>
        </div>

        <Link
          href="/admin/informasi/magang"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          <FiArrowLeft size={16} />
          Kembali
        </Link>
      </div>

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
                  Informasi dasar program magang
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-4 sm:p-6">
            <div>
              <label className={labelClass}>Nama Program Magang *</label>
              <input
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
                maxLength={150}
                placeholder="Contoh: Program Magang Kampus Merdeka 2027"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Penyelenggara *</label>
                <input
                  value={penyelenggara}
                  onChange={(e) => setPenyelenggara(e.target.value)}
                  required
                  placeholder="Nama perusahaan atau lembaga"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Posisi Magang *</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={posisi}
                    onChange={(e) => setPosisi(e.target.value)}
                    required
                    placeholder="Contoh: Digital Marketing"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Lokasi Magang *</label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  required
                  placeholder="Contoh: Surakarta / Remote / Hybrid"
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Deskripsi Magang *</label>
              <textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                required
                rows={5}
                placeholder="Jelaskan program dan aktivitas magang..."
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </section>

        {/* DETAIL */}
        <section className="overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white shadow-sm">
          <div className="border-b border-[#E8EDE9] bg-[#FAFBF9] px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F4B3B]/10 text-[#1F4B3B]">
                <FiCalendar size={19} />
              </div>
              <div>
                <h2 className="font-bold text-[#1F4B3B]">
                  Detail Program
                </h2>
                <p className="text-xs text-gray-500">
                  Persyaratan, manfaat, dan periode pendaftaran
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-4 sm:p-6">
            <div>
              <label className={labelClass}>Persyaratan</label>
              <textarea
                value={persyaratan}
                onChange={(e) => setPersyaratan(e.target.value)}
                rows={5}
                placeholder="Masukkan persyaratan, satu poin per baris..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div>
              <label className={labelClass}>Manfaat Magang</label>
              <textarea
                value={manfaat}
                onChange={(e) => setManfaat(e.target.value)}
                rows={4}
                placeholder="Jelaskan manfaat yang diperoleh peserta..."
                className={`${inputClass} resize-y`}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Tanggal Mulai *</label>
                <input
                  type="date"
                  value={tanggalMulai}
                  onChange={(e) => setTanggalMulai(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Tanggal Selesai *</label>
                <input
                  type="date"
                  value={tanggalSelesai}
                  min={tanggalMulai || undefined}
                  onChange={(e) => setTanggalSelesai(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Link Pendaftaran</label>
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
                  Poster Magang
                </h2>
                <p className="text-xs text-gray-500">
                  Upload poster program magang
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
                    alt="Preview poster Magang"
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
                    Pilih poster Magang
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    JPG, PNG, atau WebP
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Maksimal 5 MB
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
                className="mt-3 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
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
              Atur status informasi magang
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <label className={labelClass}>Pilih Status</label>
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

            <p className="mt-2 text-xs text-gray-400">
              Draft belum dipublikasikan. Status aktif dan ditutup
              digunakan untuk mengatur informasi kepada pengunjung.
            </p>
          </div>
        </section>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <FiAlertCircle className="mt-0.5 shrink-0" size={19} />
            <p className="break-words leading-relaxed">{error}</p>
          </div>
        )}

        {/* TOMBOL */}
        <div className="sticky bottom-0 z-10 -mx-3 border-t border-gray-100 bg-white/95 p-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/informasi/magang"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 sm:w-auto"
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
                  {uploading ? "Mengunggah poster..." : "Menyimpan..."}
                </>
              ) : (
                <>
                  <FiSave size={17} />
                  {mode === "create" ? "Simpan Magang" : "Simpan Perubahan"}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </form>
    </div>
  );
}
