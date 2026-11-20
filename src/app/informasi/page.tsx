
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiArrowRight,
  FiArrowUpRight,
  FiBookOpen,
  FiBriefcase,
  FiBell,
  FiCalendar,
  FiMapPin,
  FiRefreshCw,
  FiFileText,
  FiCheckCircle,
  FiStar,
  FiInfo,
  FiCompass,
} from "react-icons/fi";

import { getBeasiswa } from "@/lib/beasiswa";
import { getMagang } from "@/lib/magang";
import { getPengumuman } from "@/lib/pengumuman";

type Category = "Semua" | "Beasiswa" | "Magang" | "Pengumuman";

interface InformationItem {
  id: string;
  judul: string;
  kategori: Exclude<Category, "Semua">;
  deskripsi: string;
  gambar: string;
  tanggal: string;
  penyelenggara: string;
  tambahan: string;
  href: string;
}

const filters: Category[] = [
  "Semua",
  "Beasiswa",
  "Magang",
  "Pengumuman",
];

const categoryConfig = {
  Beasiswa: {
    icon: FiBookOpen,
    color: "bg-emerald-50 text-emerald-700",
  },
  Magang: {
    icon: FiBriefcase,
    color: "bg-amber-50 text-amber-700",
  },
  Pengumuman: {
    icon: FiBell,
    color: "bg-blue-50 text-blue-700",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

function formatDate(value?: string) {
  if (!value) return "Tanggal belum tersedia";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function InformasiPage() {
  const [information, setInformation] = useState<InformationItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<Category>("Semua");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // AMBIL DATA DARI FIRESTORE
  // ==========================================

  const loadInformation = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [beasiswaData, magangData, pengumumanData] =
        await Promise.all([
          getBeasiswa(),
          getMagang(),
          getPengumuman(),
        ]);

      const beasiswaItems: InformationItem[] = beasiswaData
        .filter((item) => item.status === "aktif")
        .map((item) => ({
          id: item.id,
          judul: item.judul,
          kategori: "Beasiswa",
          deskripsi: item.deskripsi || "",
          gambar: item.gambar || "",
          tanggal: item.tanggalMulai || "",
          penyelenggara: item.penyelenggara || "",
          tambahan: item.tanggalSelesai
            ? `Pendaftaran berakhir ${formatDate(item.tanggalSelesai)}`
            : "Informasi beasiswa",
          href: `/informasi/beasiswa/${item.id}`,
        }));

      const magangItems: InformationItem[] = magangData
        .filter((item) => item.status === "aktif")
        .map((item) => ({
          id: item.id,
          judul: item.judul,
          kategori: "Magang",
          deskripsi: item.deskripsi || "",
          gambar: item.gambar || "",
          tanggal: item.tanggalMulai || "",
          penyelenggara: item.penyelenggara || "",
          tambahan: item.lokasi
            ? `${item.posisi || "Program Magang"} • ${item.lokasi}`
            : item.posisi || "Informasi magang",
          href: `/informasi/magang/${item.id}`,
        }));

      const pengumumanItems: InformationItem[] = pengumumanData
        .filter((item) => item.status === "aktif")
        .map((item) => ({
          id: item.id || "",
          judul: item.judul,
          kategori: "Pengumuman",
          deskripsi: item.isi || "",
          gambar: item.gambar || "",
          tanggal: item.tanggalPublikasi || "",
          penyelenggara: "AksaleraVerse",
          tambahan: "Pengumuman kampus",
          href: `/informasi/pengumuman/${item.id}`,
        }));

      const allInformation = [
        ...beasiswaItems,
        ...magangItems,
        ...pengumumanItems,
      ];

      allInformation.sort((a, b) => {
        const dateA = new Date(a.tanggal).getTime() || 0;
        const dateB = new Date(b.tanggal).getTime() || 0;

        return dateB - dateA;
      });

      setInformation(allInformation);
    } catch (err) {
      console.error("Gagal mengambil informasi:", err);

      setError(
        "Informasi belum dapat dimuat. Silakan coba beberapa saat lagi."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInformation();
  }, [loadInformation]);

  // ==========================================
  // PENCARIAN DAN FILTER
  // ==========================================

  const filteredInformation = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return information.filter((item) => {
      const matchesCategory =
        activeCategory === "Semua" ||
        item.kategori === activeCategory;

      const matchesSearch =
        !keyword ||
        item.judul.toLowerCase().includes(keyword) ||
        item.deskripsi.toLowerCase().includes(keyword) ||
        item.kategori.toLowerCase().includes(keyword) ||
        item.penyelenggara.toLowerCase().includes(keyword) ||
        item.tambahan.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [information, search, activeCategory]);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#202820]">

      {/* =========================================
          HERO SECTION
      ========================================== */}

      <section className="bg-white">
        <div className="mx-auto grid min-h-[540px] max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 lg:px-10 lg:py-16">

          {/* HERO TEXT */}
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
                Student Information Platform
              </span>
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-[#1F4B3B] sm:text-5xl lg:text-[62px]">
              Temukan
              <br />
              Beragam
              <span className="relative ml-2 inline-block">
                Peluang.
                <span className="absolute -bottom-1 left-0 -z-0 h-3 w-full rounded-full bg-[#D6C99D]/70" />
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-gray-600 sm:text-base">
              Selamat datang di pusat informasi AksaleraVerse.
              Temukan berbagai informasi beasiswa, kesempatan magang,
              dan pengumuman terbaru untuk mendukung perjalanan
              akademik serta pengembangan dirimu.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#daftar-informasi"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#1F4B3B] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#1F4B3B]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#173B2E]"
              >
                Jelajahi Informasi
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
                Informasi mahasiswa
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <FiCheckCircle className="text-[#1F4B3B]" size={16} />
                Akses mudah
              </div>
            </div>
          </motion.div>

          {/* HERO MASCOT */}
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
              src="/images/informasi.png"
              alt="Maskot Detektif AksaleraVerse"
              width={600}
              height={750}
              loading="eager"
              fetchPriority="high"
              className="mx-auto h-auto max-h-[280px] w-full object-contain drop-shadow-2xl sm:max-h-[330px] lg:max-h-[380px]"
            />
            </motion.div>

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
              <FiBookOpen size={24} />
            </motion.div>
          </motion.div>
        </div>

        <div className="h-px w-full bg-gray-100" />
      </section>

      {/* =========================================
          INTRODUCTION
      ========================================== */}

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
              Pusat Informasi
            </span>

            <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-[#1F4B3B] sm:text-4xl">
              Satu Tempat untuk Menemukan Berbagai Peluang
            </h2>

            <div className="mt-5 h-1.5 w-20 rounded-full bg-[#D6C99D]" />
          </div>

          <div className="space-y-5 text-sm leading-8 text-gray-600 sm:text-base">
            <p>
              AksaleraVerse menghadirkan pusat informasi yang membantu
              mahasiswa Universitas Slamet Riyadi memperoleh berbagai
              informasi kemahasiswaan dalam satu platform.
            </p>

            <p>
              Mulai dari peluang beasiswa, program magang, hingga
              pengumuman terbaru yang dapat mendukung aktivitas
              dan perkembangan mahasiswa.
            </p>

            <p className="font-semibold text-[#1F4B3B]">
              Jangan lewatkan informasi dan kesempatan yang tersedia.
            </p>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          KATEGORI INFORMASI
      ========================================== */}

      <section className="border-y border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
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
              Layanan Informasi
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#1F4B3B] sm:text-4xl">
              Jelajahi Kategori Informasi
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              Pilih kategori informasi yang ingin kamu temukan.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Beasiswa",
                description:
                  "Temukan berbagai peluang beasiswa untuk mendukung perjalanan pendidikanmu.",
                icon: FiBookOpen,
                color: "bg-emerald-50 text-emerald-700",
                number: "01",
              },
              {
                title: "Magang",
                description:
                  "Jelajahi kesempatan magang untuk mengembangkan pengalaman dan kemampuan profesional.",
                icon: FiBriefcase,
                color: "bg-amber-50 text-amber-700",
                number: "02",
              },
              {
                title: "Pengumuman",
                description:
                  "Dapatkan informasi terbaru mengenai agenda dan pengumuman mahasiswa.",
                icon: FiBell,
                color: "bg-blue-50 text-blue-700",
                number: "03",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.title}
                  type="button"
                  onClick={() => {
                    setActiveCategory(item.title as Category);
                    document
                      .getElementById("daftar-informasi")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-[#1F4B3B]/20 hover:shadow-xl hover:shadow-[#1F4B3B]/5 sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}>
                      <Icon size={25} />
                    </div>

                    <span className="text-xs font-bold tracking-widest text-gray-300">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#1F4B3B]">
                    {item.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-gray-500">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                    <span className="text-xs font-bold text-[#1F4B3B]">
                      Lihat Informasi
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4EED9] text-[#1F4B3B] transition-all group-hover:bg-[#1F4B3B] group-hover:text-white">
                      <FiArrowUpRight size={18} />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          SEARCH & FILTER
      ========================================== */}

      <section
        id="daftar-informasi"
        className="sticky top-0 z-30 border-b border-gray-100 bg-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 sm:py-5 lg:flex-row lg:items-center lg:px-10">

          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition focus-within:border-[#1F4B3B]/50 sm:px-5">
            <FiSearch className="shrink-0 text-gray-400" size={20} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari informasi atau penyelenggara..."
              className="w-full min-w-0 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="shrink-0 text-xs font-semibold text-gray-400 hover:text-[#1F4B3B]"
              >
                Hapus
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 lg:max-w-[650px]">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveCategory(filter)}
                className={`shrink-0 rounded-xl border px-4 py-3 text-xs font-semibold transition-all duration-300 sm:px-5 sm:py-3.5 sm:text-sm ${
                  activeCategory === filter
                    ? "border-[#1F4B3B] bg-[#1F4B3B] text-white shadow-md"
                    : "border-gray-200 bg-white text-gray-500 hover:border-[#1F4B3B]/40 hover:text-[#1F4B3B]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          INFORMATION LIST
      ========================================== */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B38735]">
              Informasi Terbaru
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#1F4B3B] sm:text-3xl">
              Jelajahi Informasi
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Temukan berbagai informasi yang tersedia untukmu.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 sm:text-sm">
            <FiFileText size={17} />
            {loading
              ? "Memuat informasi..."
              : `${filteredInformation.length} informasi ditemukan`}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white"
              >
                <div className="h-48 bg-gray-100" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-24 rounded bg-gray-100" />
                  <div className="h-5 w-3/4 rounded bg-gray-100" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-white px-6 py-12 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => void loadInformation()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16392C]"
            >
              <FiRefreshCw size={16} />
              Coba Lagi
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredInformation.length === 0 && (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F4EED9] text-[#1F4B3B]">
              <FiSearch size={27} />
            </div>

            <h3 className="mt-5 text-lg font-bold text-gray-800">
              Informasi tidak ditemukan
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Belum ada informasi yang sesuai dengan pencarianmu.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("Semua");
              }}
              className="mt-5 text-sm font-semibold text-[#1F4B3B] hover:underline"
            >
              Reset pencarian
            </button>
          </div>
        )}

        {/* INFORMATION CARDS */}
        {!loading && !error && filteredInformation.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {filteredInformation.map((item, index) => {
              const config = categoryConfig[item.kategori];
              const Icon = config.icon;

              return (
                <motion.article
                  key={`${item.kategori}-${item.id}`}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.05, 0.3),
                  }}
                  whileHover={{ y: -6 }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:border-[#1F4B3B]/20 hover:shadow-xl hover:shadow-[#1F4B3B]/5"
                >
                  {/* IMAGE */}
                  <div className="relative h-48 overflow-hidden bg-white sm:h-52">
                    {item.gambar ? (
                      <img
                        src={item.gambar}
                        alt={item.judul}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Icon
                          size={48}
                          className="text-[#1F4B3B]/20"
                        />
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold shadow-sm ${config.color}`}
                      >
                        <Icon size={14} />
                        {item.kategori}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <FiCalendar size={14} />
                      {formatDate(item.tanggal)}
                    </div>

                    <h3 className="mt-4 line-clamp-2 text-lg font-bold leading-snug text-[#1F4B3B] transition-colors group-hover:text-[#A17C3F]">
                      {item.judul}
                    </h3>

                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-gray-500">
                      {item.deskripsi}
                    </p>

                    {item.penyelenggara && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                        <FiBriefcase size={14} />
                        <span className="line-clamp-1">
                          {item.penyelenggara}
                        </span>
                      </div>
                    )}

                    {item.tambahan && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        {item.kategori === "Magang" ? (
                          <FiMapPin size={14} />
                        ) : (
                          <FiCalendar size={14} />
                        )}

                        <span className="line-clamp-1">
                          {item.tambahan}
                        </span>
                      </div>
                    )}

                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <Link
                        href={item.href}
                        className="flex items-center justify-between text-sm font-bold text-[#1F4B3B]"
                      >
                        <span className="transition-colors group-hover:text-[#A17C3F]">
                          Baca Selengkapnya
                        </span>

                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4EED9] transition-all group-hover:rotate-45 group-hover:bg-[#1F4B3B] group-hover:text-white">
                          <FiArrowUpRight size={18} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================================
          CARA MENGAKSES INFORMASI
      ========================================== */}

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
              Akses Informasi
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#1F4B3B] sm:text-4xl">
              Temukan Informasi dengan Mudah
            </h2>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: FiSearch,
                title: "Cari Informasi",
                description:
                  "Gunakan pencarian dan filter untuk menemukan informasi yang dibutuhkan.",
              },
              {
                icon: FiFileText,
                title: "Baca Detail",
                description:
                  "Pelajari informasi lebih lanjut melalui halaman detail setiap informasi.",
              },
              {
                icon: FiCompass,
                title: "Temukan Peluang",
                description:
                  "Manfaatkan informasi yang tersedia untuk mendukung perkembanganmu.",
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

      {/* =========================================
          FINAL CTA
      ========================================== */}

      <section className="border-t border-gray-100 bg-white px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pb-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#1F4B3B] px-6 py-10 sm:px-12 sm:py-14"
        >
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D6B36A]">
                AKSALERAVERSE
              </p>

              <h2 className="mt-3 text-2xl font-bold leading-snug text-white sm:text-3xl">
                Jangan Lewatkan Peluang
                <br className="hidden sm:block" />
                untuk Berkembang.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/70">
                Terus ikuti informasi terbaru dan temukan peluang
                terbaik untuk perjalanan akademikmu.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit shrink-0 items-center gap-3 rounded-xl bg-[#F4EED9] px-6 py-3.5 text-sm font-bold text-[#1F4B3B] transition hover:-translate-y-1 hover:bg-white"
            >
              Kembali ke Beranda
              <FiArrowRight size={17} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
