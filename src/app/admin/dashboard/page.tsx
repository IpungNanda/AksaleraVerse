
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";

import {
  FiGrid,
  FiInfo,
  FiShoppingBag,
  FiBookOpen,
  FiBriefcase,
  FiVolume2,
  FiArrowUpRight,
  FiPlus,
  FiExternalLink,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiTrendingUp,
  FiPackage,
  FiArrowRight,
} from "react-icons/fi";

// ============================================
// TYPES
// ============================================

type DashboardStats = {
  informasi: number;
  beasiswa: number;
  magang: number;
  pengumuman: number;
  merchandise: number;
};

const initialStats: DashboardStats = {
  informasi: 0,
  beasiswa: 0,
  magang: 0,
  pengumuman: 0,
  merchandise: 0,
};

// ============================================
// QUICK ACCESS DATA
// ============================================

const quickAccess = [
  {
    title: "Beasiswa",
    description: "Kelola informasi program beasiswa.",
    href: "/admin/informasi/beasiswa",
    icon: FiBookOpen,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Magang",
    description: "Kelola informasi kesempatan magang.",
    href: "/admin/informasi/magang",
    icon: FiBriefcase,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Pengumuman",
    description: "Kelola pengumuman terbaru.",
    href: "/admin/informasi/pengumuman",
    icon: FiVolume2,
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Merchandise",
    description: "Kelola katalog UNISRI Merchandise.",
    href: "/admin/merchandise",
    icon: FiShoppingBag,
    color: "bg-green-50 text-green-600",
  },
];

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
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
};

// ============================================
// DATE FORMAT
// ============================================

function formatDate() {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

// ============================================
// MASCOT COMPONENT
// ============================================

function AksaleraMascot() {
  return (
    <div className="relative mx-auto w-full max-w-[290px] sm:max-w-[340px]">

      {/* Background decoration */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-4 rounded-full bg-[#F4EED9]/30 blur-3xl"
      />

      {/* Mascot video */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: [0, 1, 0, -1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 overflow-hidden rounded-[2rem] border-4 border-white/80 bg-white shadow-2xl"
      >
        <video
          src="/images/maskot-aksalera.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-label="Maskot AksaleraVerse"
          className="aspect-square w-full object-contain"
        />
      </motion.div>

      {/* Floating decorations */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
        }}
        className="absolute -right-3 -top-5 z-20 text-3xl"
      >
        ✨
      </motion.div>

      <motion.div
        animate={{
          y: [0, 8, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="absolute -bottom-3 -left-3 z-20 text-2xl"
      >
        ⭐
      </motion.div>

      {/* Mascot label */}
      <div className="absolute -bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border-4 border-[#1F4B3B] bg-[#F4EED9] px-5 py-2 shadow-lg">
        <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#1F4B3B]">
          AKSALERA MASCOT
        </p>
      </div>
    </div>
  );
}

// ============================================
// STATISTIC CARD
// ============================================

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: IconType;
  color: string;
  href: string;
  loading: boolean;
};

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  href,
  loading,
}: StatCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        href={href}
        className="group block h-full rounded-2xl border border-[#E8EDE9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#1F4B3B]/30 hover:shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} transition duration-300 group-hover:scale-110`}
          >
            <Icon size={22} />
          </div>

          <FiArrowUpRight
            size={20}
            className="text-gray-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#1F4B3B]"
          />
        </div>

        <p className="mt-5 text-sm font-medium text-gray-500">
          {title}
        </p>

        <div className="mt-1 flex items-end gap-2">
          <h3 className="text-3xl font-bold tracking-tight text-[#1F4B3B]">
            {loading ? "..." : value.toLocaleString("id-ID")}
          </h3>
          {!loading && (
            <span className="mb-1 text-[10px] font-semibold text-green-600">
              DATA LIVE
            </span>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-400">
          {description}
        </p>
      </Link>
    </motion.div>
  );
}

// ============================================
// DASHBOARD PAGE
// ============================================

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // ==========================================
  // FIRESTORE REALTIME
  // ==========================================

  useEffect(() => {
    let informasiLoaded = false;
    let merchandiseLoaded = false;
    let hasError = false;

    const updateConnection = () => {
      if (
        informasiLoaded &&
        merchandiseLoaded &&
        !hasError
      ) {
        setLoading(false);
        setConnected(true);
        setError("");
        setLastUpdated(new Date());
      }
    };

    // INFORMASI COLLECTION
    const unsubscribeInformasi = onSnapshot(
      collection(db, "informasi"),
      (snapshot) => {
        const documents = snapshot.docs.map((doc) => doc.data());

        setStats((previous) => ({
          ...previous,
          informasi: snapshot.size,
          beasiswa: documents.filter(
            (item) => item.kategori === "beasiswa"
          ).length,
          magang: documents.filter(
            (item) => item.kategori === "magang"
          ).length,
          pengumuman: documents.filter(
            (item) => item.kategori === "pengumuman"
          ).length,
        }));

        informasiLoaded = true;
        updateConnection();
      },
      (err) => {
        console.error("Informasi Firestore error:", err);

        hasError = true;
        setError("Gagal mengambil data informasi.");
        setConnected(false);
        setLoading(false);
      }
    );

    // MERCHANDISE COLLECTION
    const unsubscribeMerchandise = onSnapshot(
      collection(db, "merchandise"),
      (snapshot) => {
        setStats((previous) => ({
          ...previous,
          merchandise: snapshot.size,
        }));

        merchandiseLoaded = true;
        updateConnection();
      },
      (err) => {
        console.error("Merchandise Firestore error:", err);

        hasError = true;
        setError("Gagal mengambil data merchandise.");
        setConnected(false);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeInformasi();
      unsubscribeMerchandise();
    };
  }, []);

  // ==========================================
  // STATISTICS DATA
  // ==========================================

  const statCards: StatCardProps[] = [
    {
      title: "Total Informasi",
      value: stats.informasi,
      description: "Seluruh informasi tersimpan",
      icon: FiInfo,
      color: "bg-[#F4EED9] text-[#1F4B3B]",
      href: "/admin/informasi/beasiswa",
      loading,
    },
    {
      title: "Beasiswa",
      value: stats.beasiswa,
      description: "Informasi program beasiswa",
      icon: FiBookOpen,
      color: "bg-blue-50 text-blue-600",
      href: "/admin/informasi/beasiswa",
      loading,
    },
    {
      title: "Magang",
      value: stats.magang,
      description: "Kesempatan magang",
      icon: FiBriefcase,
      color: "bg-purple-50 text-purple-600",
      href: "/admin/informasi/magang",
      loading,
    },
    {
      title: "Pengumuman",
      value: stats.pengumuman,
      description: "Informasi dan pengumuman",
      icon: FiVolume2,
      color: "bg-orange-50 text-orange-600",
      href: "/admin/informasi/pengumuman",
      loading,
    },
    {
      title: "Merchandise",
      value: stats.merchandise,
      description: "Produk dalam katalog",
      icon: FiShoppingBag,
      color: "bg-green-50 text-green-600",
      href: "/admin/merchandise",
      loading,
    },
  ];

  // ==========================================
  // UI
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
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#789083]">
            <FiGrid size={15} />
            Administration Panel
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#1F4B3B] sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Selamat datang di pusat pengelolaan AksaleraVerse.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-xl border border-[#E8EDE9] bg-white px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4EED9] text-[#1F4B3B]">
            <FiClock size={18} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Hari ini
            </p>
            <p className="text-xs font-bold text-[#1F4B3B]">
              {formatDate()}
            </p>
          </div>
        </div>
      </motion.header>

      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-[#1F4B3B] p-6 text-white sm:p-9 lg:p-10"
      >
        {/* Decoration */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-36 right-40 h-80 w-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute right-10 top-10 hidden opacity-[0.05] lg:block">
          <FiGrid size={200} />
        </div>

        <div className="relative z-10 grid items-center gap-12 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">

          {/* Welcome content */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#C8D9A8]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4EED9]">
                Your Management Space
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
              Halo, Admin!
              <br />
              Selamat datang di
              <span className="block text-[#E8D9A9]">
                AksaleraVerse.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 md:mx-0">
              Kelola informasi beasiswa, kesempatan magang,
              pengumuman, dan UNISRI Merchandise melalui satu
              platform yang terintegrasi.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                href="/admin/informasi/beasiswa"
                className="inline-flex items-center gap-2 rounded-xl bg-[#F4EED9] px-5 py-3 text-sm font-bold text-[#1F4B3B] shadow-lg transition hover:-translate-y-1 hover:bg-white"
              >
                <FiPlus size={17} />
                Kelola Informasi
              </Link>

              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Lihat Website
                <FiExternalLink size={16} />
              </Link>
            </div>
          </div>

          {/* Mascot */}
          <div className="mx-auto w-full max-w-[280px] pt-3 md:max-w-none md:pt-0">
            <AksaleraMascot />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mx-auto mt-9 w-fit rounded-2xl rounded-tl-none bg-white px-5 py-3 text-center shadow-xl"
            >
              <p className="text-xs font-bold text-[#1F4B3B]">
                Hai, kawan! 👋
              </p>
              <p className="mt-1 text-[10px] text-gray-500">
                Siap membantu hari ini!
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* REALTIME STATUS */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 rounded-2xl border border-[#E8EDE9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3ED] text-[#1F4B3B]">
            <FiActivity size={21} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#1F4B3B]">
              Sinkronisasi Data
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {lastUpdated
                ? `Terakhir diperbarui ${lastUpdated.toLocaleTimeString("id-ID")}`
                : "Menunggu koneksi Firestore..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {connected ? (
            <>
              <FiCheckCircle className="text-green-600" size={17} />
              <span className="text-xs font-bold text-green-700">
                Real-time Aktif
              </span>
            </>
          ) : (
            <>
              <FiRefreshCw
                className={`text-orange-500 ${loading ? "animate-spin" : ""}`}
                size={17}
              />
              <span className="text-xs font-bold text-orange-600">
                {error ? "Koneksi Bermasalah" : "Menghubungkan..."}
              </span>
            </>
          )}
        </div>
      </motion.section>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error} Periksa koneksi Firebase dan Firestore Rules.
        </div>
      )}

      {/* STATISTICS */}
      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <FiTrendingUp size={19} className="text-[#1F4B3B]" />
              <h2 className="text-lg font-bold text-[#1F4B3B]">
                Ringkasan Dashboard
              </h2>
            </div>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Statistik pengelolaan konten AksaleraVerse.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#EAF3ED] px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-[#1F4B3B]">
            LIVE DATA
          </span>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {statCards.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </motion.div>
      </section>

      {/* QUICK ACCESS */}
      <section>
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <FiGrid size={19} className="text-[#1F4B3B]" />
            <h2 className="text-lg font-bold text-[#1F4B3B]">
              Akses Pengelolaan
            </h2>
          </div>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Akses cepat menuju setiap modul pengelolaan.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2"
        >
          {quickAccess.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
              >
                <Link
                  href={item.href}
                  className="group flex items-center gap-4 rounded-2xl border border-[#E8EDE9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#1F4B3B]/30 hover:shadow-xl"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color} transition group-hover:scale-110`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#1F4B3B]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {item.description}
                    </p>
                  </div>

                  <FiArrowRight
                    size={19}
                    className="shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#1F4B3B]"
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* FOOTER INFORMATION */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
              <FiPackage size={23} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#1F4B3B] sm:text-base">
                AksaleraVerse Management
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Pusat pengelolaan informasi dan UNISRI Merchandise.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-gray-500">
              Administration Panel
            </span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
