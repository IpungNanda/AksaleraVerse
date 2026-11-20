
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingBag,
  FiPackage,
  FiTag,
  FiCheckCircle,
  FiXCircle,
  FiMessageCircle,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getMerchandiseById,
  type Merchandise,
} from "@/lib/merchandise";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function DetailMerchandisePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [product, setProduct] = useState<Merchandise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const result = await getMerchandiseById(id);

        if (!active) return;

        // Pengunjung hanya boleh melihat produk aktif.
        if (!result || result.status !== "aktif") {
          setProduct(null);
          setError("Produk tidak ditemukan atau sudah tidak tersedia.");
          return;
        }

        setProduct(result);
        setActiveImage(0);
      } catch (err) {
        console.error("Gagal memuat detail merchandise:", err);

        if (active) {
          setError("Terjadi kesalahan saat memuat detail produk.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (id) {
      void loadProduct();
    }

    return () => {
      active = false;
    };
  }, [id]);

  const images = product?.gambar ?? [];
  const totalImages = images.length;

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0 ? totalImages - 1 : current - 1
    );
  };

  const nextImage = () => {
    setActiveImage((current) =>
      current === totalImages - 1 ? 0 : current + 1
    );
  };

  const whatsappLink = product?.whatsapp
    ? `https://wa.me/${product.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Halo, saya tertarik untuk memesan produk ${product.nama}. Apakah produk ini masih tersedia?`
      )}`
    : "";

  if (loading) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#FAFBF9] px-4">
        <FiRefreshCw
          className="animate-spin text-[#1F4B3B]"
          size={32}
        />
        <p className="text-sm text-gray-500">
          Memuat detail produk...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FAFBF9] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#E8EDE9] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <FiAlertCircle size={30} />
          </div>

          <h1 className="mt-5 text-xl font-extrabold text-[#1F4B3B]">
            Produk Tidak Ditemukan
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {error || "Produk yang kamu cari tidak tersedia."}
          </p>

          <Link
            href="/merchandise"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#17392D]"
          >
            <FiArrowLeft />
            Kembali ke Merchandise
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAFBF9]">
      {/* HEADER / BREADCRUMB */}
      <section className="border-b border-[#E8EDE9] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <Link
              href="/"
              className="transition hover:text-[#1F4B3B]"
            >
              Beranda
            </Link>

            <span>/</span>

            <Link
              href="/merchandise"
              className="transition hover:text-[#1F4B3B]"
            >
              Merchandise
            </Link>

            <span>/</span>

            <span className="max-w-[180px] truncate font-semibold text-[#1F4B3B]">
              {product.nama}
            </span>
          </div>

          <Link
            href="/merchandise"
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#1F4B3B] transition hover:gap-3"
          >
            <FiArrowLeft size={16} />
            Kembali ke Katalog
          </Link>
        </div>
      </section>

      {/* PRODUCT DETAIL */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* PRODUCT GALLERY */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-[#E8EDE9] bg-white p-3 shadow-sm sm:p-5">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4EED9]">
                {totalImages > 0 ? (
                  <Image
                    src={images[activeImage]}
                    alt={`${product.nama} - Foto ${activeImage + 1}`}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-contain p-3 sm:p-6"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-[#1F4B3B]/40">
                    <FiShoppingBag size={64} />
                    <p className="mt-3 text-sm font-medium">
                      Belum ada foto produk
                    </p>
                  </div>
                )}

                {totalImages > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={previousImage}
                      aria-label="Foto sebelumnya"
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1F4B3B] shadow-lg transition hover:bg-[#1F4B3B] hover:text-white sm:left-4 sm:h-12 sm:w-12"
                    >
                      <FiChevronLeft size={22} />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Foto berikutnya"
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1F4B3B] shadow-lg transition hover:bg-[#1F4B3B] hover:text-white sm:right-4 sm:h-12 sm:w-12"
                    >
                      <FiChevronRight size={22} />
                    </button>

                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#1F4B3B]/90 px-4 py-2 text-[10px] font-bold text-white">
                      {activeImage + 1} / {totalImages}
                    </span>
                  </>
                )}
              </div>

              {/* THUMBNAILS */}
              {totalImages > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Pilih foto ${index + 1}`}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-[#F4EED9] transition sm:h-20 sm:w-20 ${
                        activeImage === index
                          ? "border-[#1F4B3B] ring-2 ring-[#1F4B3B]/10"
                          : "border-transparent opacity-65 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.nama} thumbnail ${index + 1}`}
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-[#E8EDE9] bg-white p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                  <FiPackage size={22} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#1F4B3B]">
                    AksaleraVerse Merchandise
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Produk resmi dalam katalog merchandise.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F4EED9] px-3 py-1.5 text-xs font-bold text-[#1F4B3B]">
                <FiTag size={13} />
                {product.kategori}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                <FiCheckCircle size={13} />
                Produk Aktif
              </span>
            </div>

            <h1 className="mt-5 break-words text-2xl font-extrabold leading-tight text-[#1F4B3B] sm:text-3xl lg:text-4xl">
              {product.nama}
            </h1>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-500 sm:text-base">
              {product.deskripsi || "Belum ada deskripsi produk."}
            </p>

            {/* PRICE */}
            <div className="mt-7 rounded-2xl border border-[#E8EDE9] bg-white p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Harga Produk
              </p>

              <p className="mt-2 break-words text-2xl font-extrabold text-[#1F4B3B] sm:text-3xl">
                {formatRupiah(product.harga)}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                {product.stok > 0 ? (
                  <>
                    <FiCheckCircle
                      className="text-green-600"
                      size={17}
                    />
                    <span className="text-sm font-semibold text-green-700">
                      Stok tersedia: {product.stok} unit
                    </span>
                  </>
                ) : (
                  <>
                    <FiXCircle
                      className="text-red-500"
                      size={17}
                    />
                    <span className="text-sm font-semibold text-red-600">
                      Stok sedang habis
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* PRODUCT INFORMATION */}
            <div className="mt-6">
              <h2 className="text-base font-bold text-[#1F4B3B]">
                Informasi Produk
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#E8EDE9] bg-white p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiTag size={16} />
                    <span className="text-xs">Kategori</span>
                  </div>

                  <p className="mt-2 break-words text-sm font-bold text-[#1F4B3B]">
                    {product.kategori}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E8EDE9] bg-white p-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiPackage size={16} />
                    <span className="text-xs">Jumlah Stok</span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-[#1F4B3B]">
                    {product.stok} unit
                  </p>
                </div>
              </div>
            </div>

            {/* DETAIL */}
            {product.detail && (
              <div className="mt-7">
                <h2 className="text-base font-bold text-[#1F4B3B]">
                  Detail Produk
                </h2>

                <div className="mt-3 rounded-2xl border border-[#E8EDE9] bg-white p-5">
                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-600">
                    {product.detail}
                  </p>
                </div>
              </div>
            )}

            {/* ORDER BUTTON */}
            <div className="mt-8 rounded-2xl bg-[#1F4B3B] p-5 sm:p-6">
              <h2 className="text-base font-bold text-white">
                Tertarik dengan produk ini?
              </h2>

              <p className="mt-2 text-xs leading-6 text-white/70 sm:text-sm">
                Hubungi penjual melalui WhatsApp untuk
                menanyakan ketersediaan dan melakukan pemesanan.
              </p>

              {product.stok > 0 && whatsappLink ? (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F4EED9] px-5 py-3.5 text-sm font-extrabold text-[#1F4B3B] transition hover:bg-white"
                >
                  <FiMessageCircle size={19} />
                  Pesan Melalui WhatsApp
                  <FiArrowRight size={17} />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/20 px-5 py-3.5 text-sm font-bold text-white/60"
                >
                  {product.stok <= 0
                    ? "Stok Produk Habis"
                    : "Nomor WhatsApp Belum Tersedia"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BACK TO CATALOG */}
        <div className="mt-10 border-t border-[#E8EDE9] pt-7">
          <Link
            href="/merchandise"
            className="inline-flex items-center gap-2 rounded-xl border border-[#1F4B3B] px-5 py-3 text-sm font-bold text-[#1F4B3B] transition hover:bg-[#1F4B3B] hover:text-white"
          >
            <FiArrowLeft size={17} />
            Kembali ke Katalog Merchandise
          </Link>
        </div>
      </section>
    </main>
  );
}
