
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiSearch,
  FiShoppingBag,
  FiPackage,
  FiFilter,
  FiRefreshCw,
  FiCheckCircle,
  FiTruck,
  FiHeart,
  FiStar,
} from "react-icons/fi";

import {
  getMerchandiseAktif,
  type Merchandise,
} from "@/lib/merchandise";

const KATEGORI = [
  "Semua",
  "Pakaian",
  "Aksesori",
  "Alat Tulis",
  "Perlengkapan",
  "Lainnya",
];

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

// ==========================================
// PRODUCT CARD
// ==========================================

function ProductCard({
  item,
  index,
}: {
  item: Merchandise;
  index: number;
}) {
  const image = item.gambar?.[0];

  return (
    <motion.div
      layout
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Link
        href={`/merchandise/${item.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-[#1F4B3B]/30 hover:shadow-xl hover:shadow-[#1F4B3B]/5"
      >
        {/* PRODUCT IMAGE */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          {image ? (
            <Image
              src={image}
              alt={item.nama}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#1F4B3B]/40">
              <FiShoppingBag size={42} />
            </div>
          )}

          <span className="absolute left-3 top-3 rounded-full border border-gray-100 bg-white px-3 py-1.5 text-[10px] font-bold text-[#1F4B3B] shadow-sm">
            {item.kategori}
          </span>

          {item.stok <= 0 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-bold text-white">
              Stok Habis
            </span>
          )}
        </div>

        {/* PRODUCT INFORMATION */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h2 className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-[#1F4B3B] transition-colors group-hover:text-[#8B784A] sm:text-base">
            {item.nama}
          </h2>

          <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-6 text-gray-500 sm:text-sm">
            {item.deskripsi || "Produk merchandise AksaleraVerse."}
          </p>

          <div className="mt-auto pt-5">
            <p className="text-base font-extrabold text-[#1F4B3B] sm:text-lg">
              {formatRupiah(item.harga)}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-[11px] text-gray-500">
                Stok: {item.stok}
              </span>

              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#1F4B3B]">
                Lihat Detail
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4EED9] transition-all group-hover:bg-[#1F4B3B] group-hover:text-white">
                  <FiArrowUpRight size={16} />
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ==========================================
// MERCHANDISE PAGE
// ==========================================

export default function MerchandisePage() {
  const [products, setProducts] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // LOAD FIRESTORE DATA
  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const result = await getMerchandiseAktif();

        if (active) {
          setProducts(result);
        }
      } catch (err) {
        console.error("Gagal memuat merchandise:", err);

        if (active) {
          setError("Produk belum dapat dimuat. Silakan coba kembali.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  // SEARCH AND CATEGORY FILTER
  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((item) => {
      const matchSearch =
        !keyword ||
        item.nama.toLowerCase().includes(keyword) ||
        (item.deskripsi ?? "").toLowerCase().includes(keyword) ||
        item.kategori.toLowerCase().includes(keyword);

      const matchCategory =
        selectedCategory === "Semua" ||
        item.kategori.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [products, search, selectedCategory]);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#202820]">

      {/* ==========================================
          HERO SECTION
      =========================================== */}

      <section className="bg-white">
        <div className="mx-auto grid min-h-[560px] max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-14 md:grid-cols-2 lg:px-10 lg:py-16">

          {/* HERO CONTENT */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#1F4B3B]/15 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#1F4B3B]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1F4B3B] sm:text-xs">
                AksaleraVerse Official Merchandise
              </span>
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-[#1F4B3B] sm:text-5xl lg:text-[62px]">
              Tunjukkan
              <br />
              Identitas
              <span className="relative ml-2 inline-block">
                Mahasiswa.
                <span className="absolute -bottom-1 left-0 -z-0 h-3 w-full rounded-full bg-[#D6C99D]/70" />
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-gray-600 sm:text-base">
              Temukan berbagai pilihan merchandise AksaleraVerse.
              Tunjukkan identitas dan semangat kebersamaan mahasiswa
              Universitas Slamet Riyadi melalui produk pilihanmu.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#katalog"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#1F4B3B] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#1F4B3B]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#173B2E]"
              >
                Jelajahi Merchandise
                <FiArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1F4B3B]/20 bg-white px-7 py-4 text-sm font-bold text-[#1F4B3B] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F4EED9]"
              >
                Kembali ke Beranda
                <FiArrowUpRight size={17} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <FiCheckCircle className="text-[#1F4B3B]" size={16} />
                Produk pilihan
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <FiCheckCircle className="text-[#1F4B3B]" size={16} />
                Pemesanan mudah
              </div>
            </div>
          </motion.div>

          {/* MASCOT - TRANSPARENT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 25 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto flex w-full max-w-[530px] items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full"
            >
              <Image
                src="/images/maskot-merchandise.png"
                alt="Maskot Merchandise AksaleraVerse"
                width={650}
                height={700}
                priority
                unoptimized
                className="mx-auto h-auto max-h-[280px] w-full object-contain drop-shadow-2xl sm:max-h-[330px] lg:max-h-[380px]"
              />
            </motion.div>

            {/* DECORATIVE ICON */}
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute right-2 top-12 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white text-[#B38735] shadow-lg sm:right-5"
            >
              <FiStar size={25} />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-16 left-2 z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F4B3B] text-white shadow-lg sm:left-5"
            >
              <FiShoppingBag size={24} />
            </motion.div>
          </motion.div>
        </div>

        <div className="h-px w-full bg-gray-100" />
      </section>

      {/* ==========================================
          INTRODUCTION
      =========================================== */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-10 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B784A]">
              Mengenal Merchandise
            </span>

            <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-[#1F4B3B] sm:text-4xl">
              Lebih dari Sekadar Produk, Bagian dari Identitas Kita
            </h2>

            <div className="mt-5 h-1.5 w-20 rounded-full bg-[#D6C99D]" />
          </div>

          <div className="space-y-5 text-sm leading-8 text-gray-600 sm:text-base">
            <p>
              Merchandise AksaleraVerse hadir sebagai pilihan produk
              yang membawa identitas dan semangat kebersamaan mahasiswa
              Universitas Slamet Riyadi.
            </p>

            <p>
              Jelajahi katalog produk, lihat informasi setiap merchandise,
              dan lakukan pemesanan secara praktis melalui WhatsApp.
            </p>

            <p className="font-semibold text-[#1F4B3B]">
              Satu identitas, satu kebersamaan, satu AksaleraVerse.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ==========================================
          PRODUCT CATALOG
      =========================================== */}

      <section
        id="katalog"
        className="bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B784A]">
              Katalog Produk
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#1F4B3B] sm:text-4xl">
              Temukan Merchandise Favoritmu
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
              Pilih produk yang kamu inginkan dan lihat detail
              merchandise yang tersedia.
            </p>
          </motion.div>

          {/* SEARCH */}
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={19}
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama produk atau kategori..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/10"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("Semua");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 transition hover:border-[#1F4B3B] hover:text-[#1F4B3B]"
            >
              <FiRefreshCw size={15} />
              Reset Filter
            </button>
          </div>

          {/* CATEGORY FILTER */}
          <div className="mt-7">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#1F4B3B]">
              <FiFilter size={15} />
              KATEGORI PRODUK
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3">
              {KATEGORI.map((category) => {
                const active = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 rounded-full border px-5 py-2.5 text-xs font-semibold transition-all duration-300 ${
                      active
                        ? "border-[#1F4B3B] bg-[#1F4B3B] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#1F4B3B] hover:text-[#1F4B3B]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRODUCT COUNT */}
          <div className="mb-6 mt-7 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              Menampilkan{" "}
              <strong className="text-[#1F4B3B]">
                {filteredProducts.length}
              </strong>{" "}
              produk
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
              <FiPackage className="text-[#1F4B3B]" size={16} />
              {products.length} produk tersedia
            </div>
          </div>

          {/* PRODUCT GRID */}
          {loading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-4">
              <FiRefreshCw
                className="animate-spin text-[#1F4B3B]"
                size={30}
              />

              <p className="text-sm text-gray-500">
                Memuat katalog merchandise...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
              <p className="text-sm font-semibold text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-[#1F4B3B] px-5 py-2.5 text-xs font-bold text-white"
              >
                Muat Ulang
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4EED9] text-[#1F4B3B]">
                <FiShoppingBag size={30} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#1F4B3B]">
                Produk Tidak Ditemukan
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Tidak ada produk yang sesuai dengan pencarian
                atau kategori yang dipilih.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("Semua");
                }}
                className="mt-5 rounded-xl bg-[#1F4B3B] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#173B2E]"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredProducts.map((item, index) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ==========================================
          HOW TO ORDER
      =========================================== */}

      <section className="border-t border-gray-100 bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 max-w-2xl"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B784A]">
              Cara Pemesanan
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#1F4B3B] sm:text-4xl">
              Belanja Merchandise Lebih Praktis
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: FiSearch,
                title: "Pilih Produk",
                description:
                  "Jelajahi katalog dan temukan merchandise yang kamu inginkan.",
              },
              {
                icon: FiPackage,
                title: "Lihat Detail",
                description:
                  "Periksa informasi produk, harga, dan ketersediaan stok.",
              },
              {
                icon: FiTruck,
                title: "Pesan melalui WhatsApp",
                description:
                  "Hubungi kontak pemesanan yang tersedia pada halaman produk.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                  }}
                  className="rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#1F4B3B]/20 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 font-bold text-[#1F4B3B]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-gray-500">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================
          FINAL CTA
      =========================================== */}

      <section className="border-t border-gray-100 bg-white px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pb-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl rounded-[28px] border border-[#1F4B3B]/10 bg-white px-7 py-14 text-center sm:px-12 lg:py-20"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#1F4B3B]/15 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1F4B3B]">
            <FiHeart size={13} />
            AksaleraVerse Merchandise
          </span>

          <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#1F4B3B] sm:text-4xl lg:text-5xl">
            Tunjukkan Identitasmu
            <br />
            Bersama AksaleraVerse
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-8 text-gray-500 sm:text-base">
            Temukan produk favoritmu dan jadilah bagian dari
            semangat kebersamaan mahasiswa UNISRI.
          </p>

          <Link
            href="#katalog"
            className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-[#1F4B3B] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#173B2E]"
          >
            Lihat Merchandise
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
