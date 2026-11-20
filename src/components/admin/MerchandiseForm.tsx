
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiSave, FiUpload, FiX, FiImage } from "react-icons/fi";

import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  createMerchandise,
  updateMerchandise,
  type Merchandise,
  type MerchandiseInput,
  type StatusMerchandise,
} from "@/lib/merchandise";

interface Props {
  mode: "create" | "edit";
  initialData?: Merchandise;
}

interface PreviewImage {
  id: string;
  url: string;
  file?: File;
}

const MAX_IMAGES = 5;

export default function MerchandiseForm({
  mode,
  initialData,
}: Props) {
  const router = useRouter();

  const [nama, setNama] = useState(initialData?.nama ?? "");
  const [kategori, setKategori] = useState(
    initialData?.kategori ?? "Pakaian"
  );
  const [deskripsi, setDeskripsi] = useState(
    initialData?.deskripsi ?? ""
  );
  const [detail, setDetail] = useState(initialData?.detail ?? "");
  const [harga, setHarga] = useState(
    initialData?.harga?.toString() ?? ""
  );
  const [stok, setStok] = useState(
    initialData?.stok?.toString() ?? "0"
  );
  const [whatsapp, setWhatsapp] = useState(
    initialData?.whatsapp ?? ""
  );
  const [status, setStatus] = useState<StatusMerchandise>(
    initialData?.status ?? "aktif"
  );

  const [images, setImages] = useState<PreviewImage[]>(
    (initialData?.gambar ?? []).map((url, index) => ({
      id: `old-${index}`,
      url,
    }))
  );

  const imagesRef = useRef(images);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        if (image.file) URL.revokeObjectURL(image.url);
      });
    };
  }, []);

  const handleImages = (files: FileList | null) => {
    if (!files) return;

    const selectedFiles = Array.from(files);
    const availableSlots = MAX_IMAGES - images.length;

    if (selectedFiles.length > availableSlots) {
      setError(`Maksimal ${MAX_IMAGES} foto produk.`);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        setError("Format gambar harus JPG, PNG, atau WEBP.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran setiap gambar maksimal 5 MB.");
        return;
      }
    }

    const newImages = selectedFiles.map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((previous) => [...previous, ...newImages]);
    setError("");
  };

  const removeImage = (id: string) => {
    setImages((previous) => {
      const selected = previous.find((image) => image.id === id);

      if (selected?.file) {
        URL.revokeObjectURL(selected.url);
      }

      return previous.filter((image) => image.id !== id);
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (
      !nama.trim() ||
      !kategori.trim() ||
      !deskripsi.trim() ||
      !whatsapp.trim()
    ) {
      setError(
        "Nama, kategori, deskripsi, dan nomor WhatsApp wajib diisi."
      );
      return;
    }

    const cleanWhatsapp = whatsapp.replace(/\D/g, "");

    if (!/^62\d{8,13}$/.test(cleanWhatsapp)) {
      setError(
        "Nomor WhatsApp harus menggunakan format 62, contoh: 6281234567890."
      );
      return;
    }

    const hargaNumber = Number(harga);
    const stokNumber = Number(stok);

    if (!Number.isSafeInteger(hargaNumber) || hargaNumber < 0) {
      setError("Harga harus berupa angka bulat dan tidak negatif.");
      return;
    }

    if (!Number.isSafeInteger(stokNumber) || stokNumber < 0) {
      setError("Stok harus berupa bilangan bulat dan tidak negatif.");
      return;
    }

    setLoading(true);

    try {
      const uploadedImages: string[] = [];

      for (const image of images) {
        if (image.file) {
          const url = await uploadToCloudinary(
            image.file,
            "aksaleraverse/merchandise"
          );

          uploadedImages.push(url);
        } else {
          uploadedImages.push(image.url);
        }
      }

      const data: MerchandiseInput = {
        nama: nama.trim(),
        kategori,
        deskripsi: deskripsi.trim(),
        detail: detail.trim(),
        harga: hargaNumber,
        stok: stokNumber,
        whatsapp: cleanWhatsapp,
        gambar: uploadedImages,
        status,
      };

      if (mode === "create") {
        await createMerchandise(data);
      } else if (initialData?.id) {
        await updateMerchandise(initialData.id, data);
      } else {
        throw new Error("ID produk tidak ditemukan.");
      }

      router.push("/admin/merchandise");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan produk."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <h2 className="mb-6 text-lg font-bold text-[#1F4B3B]">
          Informasi Produk
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Nama Produk *
            </label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Kaos UNISRI"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Kategori *
            </label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
            >
              <option value="Pakaian">Pakaian</option>
              <option value="Aksesori">Aksesori</option>
              <option value="Alat Tulis">Alat Tulis</option>
              <option value="Perlengkapan">Perlengkapan</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Deskripsi Singkat *
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              required
              placeholder="Deskripsi singkat produk..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Detail Produk
            </label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              rows={4}
              placeholder="Bahan, ukuran, warna, dan informasi lainnya..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Harga (Rp) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="85000"
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Stok *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
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
                  setStatus(e.target.value as StatusMerchandise)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <h2 className="mb-2 text-lg font-bold text-[#1F4B3B]">
          Nomor WhatsApp Penjual
        </h2>
        <p className="mb-4 text-sm text-gray-500">
          Nomor ini akan menerima pesan pemesanan dari pengunjung.
        </p>

        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Nomor WhatsApp *
        </label>
        <input
          type="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="6281234567890"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
        />
        <p className="mt-2 text-xs text-gray-500">
          Gunakan kode negara 62 tanpa tanda + atau angka 0 di awal.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
        <h2 className="mb-2 text-lg font-bold text-[#1F4B3B]">
          Foto Produk
        </h2>
        <p className="mb-5 text-sm text-gray-500">
          Foto bersifat opsional. Maksimal 5 foto, JPG, PNG, atau WEBP,
          maksimal 5 MB per foto.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-xl border"
            >
              <Image
                src={image.url}
                alt="Preview produk"
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                aria-label="Hapus foto"
                className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white"
              >
                <FiX />
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-[#1F4B3B]">
              <FiImage className="mb-2 text-3xl text-[#1F4B3B]" />
              <span className="text-xs font-semibold text-gray-600">
                Tambah Foto
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  handleImages(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          )}
        </div>
      </section>

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
          className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#17392D] disabled:opacity-60"
        >
          <FiSave />
          {loading ? "Menyimpan..." : "Simpan Produk"}
        </button>
      </div>
    </form>
  );
}
