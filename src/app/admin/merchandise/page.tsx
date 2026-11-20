
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import {
  FiPlus,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiShoppingBag,
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiFilter,
  FiArrowUpRight,
  FiPhone,
  FiBox,
  FiX,
} from "react-icons/fi";

import { checkAdminPermission } from "@/lib/auth";

import {
  deleteMerchandise,
  getMerchandise,
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
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut" as const,
    },
  },
};

// ============================================
// HELPERS
// ============================================

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

function formatPhone(value?: string) {
  if (!value) return "-";
  return value;
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
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
        isActive
          ? "border-green-100 bg-green-50 text-green-700"
          : "border-gray-200 bg-gray-100 text-gray-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {isActive ? "Aktif" : "Nonaktif"}
    </span>
  );
}

// ============================================
// PRODUCT IMAGE
// ============================================

function ProductImage({
  src,
  name,
  size = "large",
}: {
  src?: string;
  name: string;
  size?: "small" | "large";
}) {
  const dimensions =
    size === "small"
      ? "h-14 w-14 rounded-xl"
      : "h-24 w-full rounded-xl";

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-[#F4EED9] ${dimensions}`}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          unoptimized
          sizes={size === "small" ? "56px" : "200px"}
          className="object-cover transition duration-500 hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[#1F4B3B]/50">
          <FiShoppingBag size={size === "small" ? 22 : 32} />
        </div>
      )}
    </div>
  );
}

// ============================================
// ACTION BUTTON
// ============================================

function ActionButton({
  href,
  icon: Icon,
  label,
  color,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition duration-200 hover:scale-105 ${color}`}
    >
      <Icon size={16} />
    </Link>
  );
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState({
  search,
  onReset,
}: {
  search: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F4EED9] text-[#1F4B3B]">
        <FiShoppingBag size={34} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#1F4B3B]">
        Produk Tidak Ditemukan
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        {search
          ? "Tidak ada produk yang sesuai dengan pencarian atau filter yang dipilih."
          : "Belum ada produk merchandise yang ditambahkan."}
      </p>

      {search && (
        <button
          onClick={onReset}
          className="mt-5 rounded-xl bg-[#1F4B3B] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#17392D]"
        >
          Reset Pencarian
        </button>
      )}
    </div>
  );
}

// ============================================
// STATISTIC CARD
// ============================================

function StatisticCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="group rounded-2xl border border-[#E8EDE9] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} transition group-hover:scale-110`}
        >
          <Icon size={22} />
        </div>

        <FiArrowUpRight
          className="text-gray-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#1F4B3B]"
          size={20}
        />
      </div>

      <p className="mt-5 text-sm font-medium text-gray-500">
        {title}
      </p>

      <h3 className="mt-1 text-3xl font-extrabold tracking-tight text-[#1F4B3B]">
        {value.toLocaleString("id-ID")}
      </h3>

      <p className="mt-2 text-xs text-gray-400">
        {description}
      </p>
    </motion.div>
  );
}

// ============================================
// MOBILE PRODUCT CARD
// ============================================

function MobileProductCard({
  item,
  onDelete,
  deleting,
}: {
  item: Merchandise;
  onDelete: (item: Merchandise) => void;
  deleting: boolean;
}) {
  return (
    <motion.div
      variants={itemVariants}
      layout
      className="rounded-2xl border border-[#E8EDE9] bg-white p-4 shadow-sm"
    >
      <div className="flex gap-4">
        <ProductImage
          src={item.gambar?.[0]}
          name={item.nama}
          size="small"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-[#1F4B3B]">
                {item.nama}
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                {item.kategori}
              </p>
            </div>

            <StatusBadge status={item.status} />
          </div>

          <p className="mt-3 text-base font-extrabold text-[#1F4B3B]">
            {formatRupiah(item.harga)}
          </p>
        </div>
      </div>

      <div className="my-4 grid grid-cols-2 gap-3 border-y border-gray-100 py-3">
        <div>
          <p className="text-[10px] font-medium text-gray-400">
            Stok Produk
          </p>

          <p className="mt-1 text-sm font-bold text-[#1F4B3B]">
            {item.stok} unit
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-medium text-gray-400">
            WhatsApp Penjual
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-gray-600">
            {formatPhone(item.whatsapp)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] text-gray-400">
          Aksi pengelolaan
        </p>

        <div className="flex gap-2">
          <ActionButton
            href={`/admin/merchandise/detail/${item.id}`}
            icon={FiEye}
            label="Detail"
            color="bg-blue-50 text-blue-600 hover:bg-blue-100"
          />

          <ActionButton
            href={`/admin/merchandise/edit/${item.id}`}
            icon={FiEdit2}
            label="Edit"
            color="bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          />

          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={deleting}
            title="Hapus"
            aria-label="Hapus produk"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:scale-105 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function MerchandisePage() {
  const [data, setData] = useState<Merchandise[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ==========================================
  // LOAD DATA
  // ==========================================

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await checkAdminPermission();

      const result = await getMerchandise();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data merchandise."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // ==========================================
  // FILTER DATA
  // ==========================================

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const keyword = search.toLowerCase().trim();

      const matchName = item.nama
        .toLowerCase()
        .includes(keyword);

      const matchCategory = item.kategori
        .toLowerCase()
        .includes(keyword);

      const matchSearch = matchName || matchCategory;

      const matchStatus =
        filter === "semua" || item.status === filter;

      return matchSearch && matchStatus;
    });
  }, [data, search, filter]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalProduk = data.length;

  const produkAktif = data.filter(
    (item) => item.status === "aktif"
  ).length;

  const totalStok = data.reduce(
    (sum, item) => sum + (Number(item.stok) || 0),
    0
  );

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDelete = async (item: Merchandise) => {
    if (!item.id || deletingId) return;

    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus produk "${item.nama}"?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);

    try {
      await checkAdminPermission();
      await deleteMerchandise(item.id);

      setData((previous) =>
        previous.filter((product) => product.id !== item.id)
      );
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Gagal menghapus produk."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // RESET FILTER
  // ==========================================

  const resetFilter = () => {
    setSearch("");
    setFilter("semua");
  };

  // ==========================================
  // PAGE UI
  // ==========================================

  return (
    <div className="mx-auto max-w-7xl space-y-7 pb-10">

      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#789083]">
            <FiShoppingBag size={15} />
            Management / Merchandise
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#1F4B3B] sm:text-3xl">
            UNISRI Merchandise
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Kelola katalog produk, informasi stok, harga,
            dan nomor WhatsApp penjual.
          </p>
        </div>

        <Link
          href="/admin/merchandise/tambah"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#17392D] hover:shadow-lg"
        >
          <FiPlus size={18} />
          Tambah Produk
        </Link>
      </motion.header>

      {/* HERO BANNER */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-[#1F4B3B] p-6 sm:p-8"
      >
        <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full border border-white/10" />
        <div className="absolute -bottom-28 right-36 h-64 w-64 rounded-full border border-white/10" />

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#F4EED9]">
              Merchandise Management
            </span>

            <h2 className="mt-4 text-xl font-bold leading-tight text-white sm:text-2xl">
              Kelola Produk Merchandise
              <br className="hidden sm:block" />
              dengan Lebih Mudah.
            </h2>

            <p className="mt-3 text-xs leading-6 text-white/65 sm:text-sm">
              Atur katalog, harga, stok, dan kontak penjual
              untuk mendukung pemesanan melalui WhatsApp.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-center rounded-2xl border border-white/10 bg-white/10 text-[#F4EED9] sm:mr-5 sm:h-24 sm:w-24">
            <FiShoppingBag size={42} />
          </div>
        </div>
      </motion.section>

      {/* STATISTICS */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-[#1F4B3B]">
            Ringkasan Produk
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Gambaran umum katalog UNISRI Merchandise.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <StatisticCard
            title="Total Produk"
            value={totalProduk}
            description="Seluruh produk tersimpan"
            icon={FiShoppingBag}
            color="bg-[#F4EED9] text-[#1F4B3B]"
          />

          <StatisticCard
            title="Produk Aktif"
            value={produkAktif}
            description="Produk yang ditampilkan"
            icon={FiCheckCircle}
            color="bg-green-50 text-green-600"
          />

          <StatisticCard
            title="Total Stok"
            value={totalStok}
            description="Akumulasi stok seluruh produk"
            icon={FiPackage}
            color="bg-blue-50 text-blue-600"
          />
        </motion.div>
      </section>

      {/* SEARCH AND FILTER */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[#E8EDE9] bg-white p-4 sm:p-5"
      >
        <div className="mb-4">
          <h2 className="text-sm font-bold text-[#1F4B3B]">
            Pencarian dan Filter
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Temukan produk berdasarkan nama, kategori, atau status.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_200px_auto]">
          {/* SEARCH */}
          <div className="relative">
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau kategori produk..."
              className="w-full rounded-xl border border-gray-200 bg-[#FAFBF9] py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:bg-white focus:ring-2 focus:ring-[#1F4B3B]/10"
            />
          </div>

          {/* FILTER */}
          <div className="relative">
            <FiFilter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-[#FAFBF9] py-3 pl-10 pr-4 text-sm text-gray-600 outline-none transition focus:border-[#1F4B3B] focus:ring-2 focus:ring-[#1F4B3B]/10"
            >
              <option value="semua">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>

          {/* REFRESH */}
          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-[#1F4B3B] hover:bg-[#F4EED9]/40 hover:text-[#1F4B3B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw
              className={loading ? "animate-spin" : ""}
              size={16}
            />
            Refresh
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400">
            Menampilkan{" "}
            <span className="font-bold text-[#1F4B3B]">
              {filteredData.length}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-[#1F4B3B]">
              {data.length}
            </span>{" "}
            produk
          </p>

          {(search || filter !== "semua") && (
            <button
              type="button"
              onClick={resetFilter}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F4B3B] hover:text-red-600"
            >
              <FiX size={14} />
              Reset filter
            </button>
          )}
        </div>
      </motion.section>

      {/* ERROR */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            <FiAlertCircle size={19} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUCT LIST */}
      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#1F4B3B]">
              Daftar Produk
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Daftar seluruh produk merchandise.
            </p>
          </div>

          <span className="rounded-full bg-[#EAF3ED] px-3 py-1.5 text-[10px] font-bold text-[#1F4B3B]">
            {data.length} PRODUK
          </span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-[#E8EDE9] bg-white">
            <FiRefreshCw
              size={28}
              className="animate-spin text-[#1F4B3B]"
            />

            <p className="mt-4 text-sm font-semibold text-[#1F4B3B]">
              Memuat Data Merchandise
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Mohon tunggu sebentar...
            </p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="rounded-2xl border border-[#E8EDE9] bg-white">
            <EmptyState
              search={search || filter !== "semua" ? "filter" : ""}
              onReset={resetFilter}
            />
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="hidden overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white lg:block"
            >
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className="bg-[#F4EED9]/70 text-xs font-bold uppercase tracking-wider text-[#1F4B3B]">
                    <tr>
                      <th className="px-5 py-5">Produk</th>
                      <th className="px-5 py-5">Kategori</th>
                      <th className="px-5 py-5">Harga</th>
                      <th className="px-5 py-5">Stok</th>
                      <th className="px-5 py-5">WhatsApp</th>
                      <th className="px-5 py-5">Status</th>
                      <th className="px-5 py-5 text-right">Aksi</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredData.map((item) => (
                      <motion.tr
                        layout
                        variants={itemVariants}
                        key={item.id}
                        className="transition hover:bg-[#FAFBF9]"
                      >
                        {/* PRODUCT */}
                        <td className="px-5 py-4">
                          <div className="flex min-w-[210px] items-center gap-3">
                            <ProductImage
                              src={item.gambar?.[0]}
                              name={item.nama}
                              size="small"
                            />

                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate font-bold text-[#1F4B3B]">
                                {item.nama}
                              </p>

                              <p className="mt-1 text-[10px] text-gray-400">
                                Merchandise
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* CATEGORY */}
                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">
                            {item.kategori}
                          </span>
                        </td>

                        {/* PRICE */}
                        <td className="whitespace-nowrap px-5 py-4 font-bold text-[#1F4B3B]">
                          {formatRupiah(item.harga)}
                        </td>

                        {/* STOCK */}
                        <td className="px-5 py-4">
                          <span
                            className={`font-semibold ${
                              item.stok > 0
                                ? "text-gray-700"
                                : "text-red-500"
                            }`}
                          >
                            {item.stok}
                          </span>

                          <span className="ml-1 text-xs text-gray-400">
                            unit
                          </span>
                        </td>

                        {/* WHATSAPP */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 whitespace-nowrap text-xs text-gray-600">
                            <FiPhone className="text-green-600" />
                            {formatPhone(item.whatsapp)}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <StatusBadge status={item.status} />
                        </td>

                        {/* ACTION */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <ActionButton
                              href={`/admin/merchandise/detail/${item.id}`}
                              icon={FiEye}
                              label="Detail"
                              color="bg-blue-50 text-blue-600 hover:bg-blue-100"
                            />

                            <ActionButton
                              href={`/admin/merchandise/edit/${item.id}`}
                              icon={FiEdit2}
                              label="Edit"
                              color="bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                            />

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item.id || !!deletingId}
                              title="Hapus"
                              aria-label="Hapus produk"
                              className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:scale-105 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === item.id ? (
                                <FiRefreshCw
                                  className="animate-spin"
                                  size={16}
                                />
                              ) : (
                                <FiTrash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* TABLE FOOTER */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-[#FAFBF9] px-5 py-4">
                <p className="text-xs text-gray-400">
                  Menampilkan {filteredData.length} produk
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#1F4B3B]">
                  <FiCheckCircle size={14} />
                  Katalog Merchandise
                </div>
              </div>
            </motion.div>

            {/* MOBILE & TABLET CARDS */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden"
            >
              {filteredData.map((item) => (
                <MobileProductCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  deleting={!!deletingId}
                />
              ))}
            </motion.div>
          </>
        )}
      </section>

      {/* BOTTOM INFORMATION */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-[#E8EDE9] bg-white p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
              <FiBox size={22} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#1F4B3B]">
                UNISRI Merchandise Management
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Pengelolaan katalog dan pemesanan melalui WhatsApp.
              </p>
            </div>
          </div>

          <Link
            href="/merchandise"
            target="_blank"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1F4B3B] transition hover:text-green-700"
          >
            Lihat Katalog Publik
            <FiArrowUpRight size={16} />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
