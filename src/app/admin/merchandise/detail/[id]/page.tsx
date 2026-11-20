
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import {
  FiArrowLeft,
  FiEdit2,
  FiPackage,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiTag,
  FiDollarSign,
  FiBox,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiShoppingBag,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

import { checkAdminPermission } from "@/lib/auth";

import {
  getMerchandiseById,
  type Merchandise,
} from "@/lib/merchandise";

// ============================================
// ANIMATION
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

// ============================================
// FORMAT RUPIAH
// ============================================

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

// ============================================
// STATUS BADGE
// ============================================

function StatusBadge({
  status,
}: {
  status: Merchandise["status"];
}) {
  const isActive = status === "aktif";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${
        isActive
          ? "border-green-100 bg-green-50 text-green-700"
          : "border-gray-200 bg-gray-100 text-gray-600"
      }`}
    >
      {isActive ? (
        <FiCheckCircle size={14} />
      ) : (
        <FiXCircle size={14} />
      )}

      {isActive ? "Aktif" : "Nonaktif"}
    </span>
  );
}

// ============================================
// IMAGE SLIDER
// ============================================

function ProductImageSlider({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalImages = images.length;

  const previousImage = () => {
    setActiveIndex((current) =>
      current === 0 ? totalImages - 1 : current - 1
    );
  };

  const nextImage = () => {
    setActiveIndex((current) =>
      current === totalImages - 1 ? 0 : current + 1
    );
  };

  if (totalImages === 0) {
    return (
      <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-[#E8EDE9] bg-[#F8F9F7] text-gray-400">
        <FiPackage size={48} />
        <p className="mt-3 text-sm font-medium">
          Belum ada gambar produk
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* MAIN SLIDER */}
      <div className="group relative overflow-hidden rounded-2xl border border-[#E8EDE9] bg-[#F8F9F7]">

        <div className="relative aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-[4/3]">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeIndex]}
                alt={`${productName} - Gambar ${activeIndex + 1}`}
                fill
                priority={activeIndex === 0}
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-3 sm:p-5"
              />
            </motion.div>
          </AnimatePresence>

          {/* IMAGE COUNTER */}
          <div className="absolute left-4 top-4 z-10 rounded-full bg-[#1F4B3B]/90 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm">
            {activeIndex + 1} / {totalImages} GAMBAR
          </div>

          {/* PREVIOUS BUTTON */}
          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={previousImage}
                aria-label="Gambar sebelumnya"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[#1F4B3B] shadow-lg backdrop-blur-sm transition hover:scale-110 hover:bg-[#1F4B3B] hover:text-white sm:h-12 sm:w-12"
              >
                <FiChevronLeft size={23} />
              </button>

              {/* NEXT BUTTON */}
              <button
                type="button"
                onClick={nextImage}
                aria-label="Gambar berikutnya"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[#1F4B3B] shadow-lg backdrop-blur-sm transition hover:scale-110 hover:bg-[#1F4B3B] hover:text-white sm:h-12 sm:w-12"
              >
                <FiChevronRight size={23} />
              </button>
            </>
          )}

          {/* BOTTOM INDICATORS */}
          {totalImages > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Tampilkan gambar ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* THUMBNAILS */}
      {totalImages > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Pilih gambar ${index + 1}`}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#F8F9F7] transition duration-200 sm:h-24 sm:w-24 ${
                activeIndex === index
                  ? "border-[#1F4B3B] ring-2 ring-[#1F4B3B]/10"
                  : "border-transparent opacity-70 hover:border-gray-300 hover:opacity-100"
              }`}
            >
              <Image
                src={url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                unoptimized
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// INFORMATION ITEM
// ============================================

function DetailItem({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-[#E8EDE9] bg-[#FAFBF9] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400">
          {label}
        </p>

        <div className="mt-1 break-words text-sm font-semibold text-[#1F4B3B]">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// LOADING STATE
// ============================================

function LoadingState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4EED9] text-[#1F4B3B]"
      >
        <FiRefreshCw size={25} />
      </motion.div>

      <div className="text-center">
        <p className="text-sm font-bold text-[#1F4B3B]">
          Memuat Detail Produk
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Mohon tunggu sebentar...
        </p>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function DetailMerchandisePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<Merchandise | null>(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH DATA
  // ==========================================

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        await checkAdminPermission();

        const result = await getMerchandiseById(params.id);

        if (active) {
          setData(result);
        }
      } catch (error) {
        console.error("Gagal memuat merchandise:", error);

        if (active) {
          router.replace("/admin/login");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (params.id) {
      void load();
    }

    return () => {
      active = false;
    };
  }, [params.id, router]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <LoadingState />;
  }

  // ==========================================
  // NOT FOUND
  // ==========================================

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center rounded-3xl border border-[#E8EDE9] bg-white p-8 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <FiAlertCircle size={36} />
        </div>

        <h2 className="mt-6 text-xl font-bold text-[#1F4B3B]">
          Produk Tidak Ditemukan
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Produk yang kamu cari tidak tersedia atau mungkin
          sudah dihapus.
        </p>

        <Link
          href="/admin/merchandise"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17392D]"
        >
          <FiArrowLeft size={17} />
          Kembali ke Merchandise
        </Link>
      </motion.div>
    );
  }

  // ==========================================
  // MAIN CONTENT
  // ==========================================

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-6xl space-y-6 pb-10"
    >

      {/* HEADER */}
      <motion.header
        variants={itemVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <Link
              href="/admin/merchandise"
              className="transition hover:text-[#1F4B3B]"
            >
              Merchandise
            </Link>

            <span>/</span>

            <span className="font-semibold text-[#1F4B3B]">
              Detail Produk
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#1F4B3B] sm:text-3xl">
            Detail Merchandise
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Informasi lengkap produk UNISRI Merchandise.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/merchandise"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:border-[#1F4B3B] hover:text-[#1F4B3B] sm:flex-none"
          >
            <FiArrowLeft size={17} />
            Kembali
          </Link>

          <Link
            href={`/admin/merchandise/edit/${data.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#17392D] hover:shadow-lg sm:flex-none"
          >
            <FiEdit2 size={16} />
            Edit Produk
          </Link>
        </div>
      </motion.header>

      {/* PRODUCT MAIN CARD */}
      <motion.section
        variants={itemVariants}
        className="overflow-hidden rounded-3xl border border-[#E8EDE9] bg-white shadow-sm"
      >
        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:p-9">

          {/* LEFT: IMAGE SLIDER */}
          <div className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold text-[#1F4B3B]">
                  <FiImage size={17} />
                  Galeri Produk
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Geser gambar untuk melihat foto lainnya.
                </p>
              </div>

              <span className="rounded-full bg-[#F4EED9] px-3 py-1.5 text-[10px] font-bold text-[#1F4B3B]">
                {data.gambar?.length || 0} FOTO
              </span>
            </div>

            <ProductImageSlider
              images={data.gambar || []}
              productName={data.nama}
            />
          </div>

          {/* RIGHT: PRODUCT INFORMATION */}
          <div className="flex min-w-0 flex-col">

            {/* PRODUCT TITLE */}
            <div className="border-b border-gray-100 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={data.status} />

                <span className="rounded-full bg-gray-50 px-3 py-1.5 text-[10px] font-semibold text-gray-500">
                  {data.kategori}
                </span>
              </div>

              <h2 className="mt-5 text-2xl font-extrabold leading-tight tracking-tight text-[#1F4B3B] sm:text-3xl">
                {data.nama}
              </h2>

              <p className="mt-3 text-xs leading-6 text-gray-400">
                Produk UNISRI Merchandise
              </p>
            </div>

            {/* PRICE */}
            <div className="my-5 rounded-2xl bg-[#F4EED9]/60 p-5">
              <p className="flex items-center gap-2 text-xs font-semibold text-[#1F4B3B]/70">
                <FiDollarSign size={16} />
                Harga Produk
              </p>

              <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#1F4B3B] sm:text-3xl">
                {formatRupiah(data.harga)}
              </p>
            </div>

            {/* DETAIL GRID */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailItem
                icon={FiTag}
                label="Kategori Produk"
              >
                {data.kategori || "-"}
              </DetailItem>

              <DetailItem
                icon={FiBox}
                label="Stok Produk"
              >
                <span
                  className={
                    data.stok > 0
                      ? "text-[#1F4B3B]"
                      : "text-red-600"
                  }
                >
                  {data.stok} unit
                </span>
              </DetailItem>

              <DetailItem
                icon={FiPhone}
                label="WhatsApp Penjual"
              >
                {data.whatsapp || "-"}
              </DetailItem>

              <DetailItem
                icon={FiPackage}
                label="Status Produk"
              >
                {data.status === "aktif" ? "Aktif" : "Nonaktif"}
              </DetailItem>
            </div>

            {/* STOCK STATUS */}
            <div
              className={`mt-5 flex items-start gap-3 rounded-xl p-4 ${
                data.stok > 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {data.stok > 0 ? (
                <FiCheckCircle size={19} className="mt-0.5 shrink-0" />
              ) : (
                <FiXCircle size={19} className="mt-0.5 shrink-0" />
              )}

              <div>
                <p className="text-xs font-bold">
                  {data.stok > 0
                    ? "Produk Memiliki Stok"
                    : "Stok Produk Habis"}
                </p>

                <p className="mt-1 text-[11px] leading-5 opacity-80">
                  {data.stok > 0
                    ? `Tersedia ${data.stok} unit produk dalam katalog.`
                    : "Produk saat ini tidak memiliki stok tersedia."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT DESCRIPTION */}
        <div className="space-y-5 border-t border-gray-100 bg-[#FAFBF9] p-5 sm:p-7 lg:p-9">

          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-[#1F4B3B]">
              <FiFileText size={19} />
              Deskripsi Produk
            </h3>

            <div className="mt-4 rounded-2xl border border-[#E8EDE9] bg-white p-5 sm:p-6">
              <p className="whitespace-pre-wrap text-sm leading-8 text-gray-600">
                {data.deskripsi || "Belum ada deskripsi produk."}
              </p>
            </div>
          </div>

          {data.detail && (
            <div>
              <h3 className="flex items-center gap-2 text-base font-bold text-[#1F4B3B]">
                <FiShoppingBag size={19} />
                Detail Produk
              </h3>

              <div className="mt-4 rounded-2xl border border-[#E8EDE9] bg-white p-5 sm:p-6">
                <p className="whitespace-pre-wrap text-sm leading-8 text-gray-600">
                  {data.detail}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* BOTTOM INFORMATION */}
      <motion.section
        variants={itemVariants}
        className="rounded-2xl border border-[#E8EDE9] bg-white p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
              <FiPackage size={22} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#1F4B3B]">
                UNISRI Merchandise Management
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Informasi dan pengelolaan katalog produk.
              </p>
            </div>
          </div>

          <Link
            href={`/admin/merchandise/edit/${data.id}`}
            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#1F4B3B] transition hover:text-green-700"
          >
            Perbarui Informasi Produk
            <FiEdit2 size={15} />
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
}
