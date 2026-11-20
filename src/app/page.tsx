
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBookOpen,
  FiBriefcase,
  FiBell,
  FiShoppingBag,
  FiMessageSquare,
  FiCheckCircle,
  FiCompass,
  FiUsers,
  FiStar,
  FiShield,
} from "react-icons/fi";

// ============================================
// DATA LAYANAN
// ============================================

const services = [
  {
    number: "01",
    title: "Beasiswa",
    description:
      "Temukan berbagai informasi dan peluang beasiswa untuk mendukung perjalanan akademik mahasiswa.",
    href: "/informasi/beasiswa",
    icon: FiBookOpen,
    label: "Peluang Pendidikan",
    color: "bg-[#E9F0E9]",
  },
  {
    number: "02",
    title: "Magang",
    description:
      "Jelajahi kesempatan magang untuk mengembangkan pengalaman dan kemampuan profesional.",
    href: "/informasi/magang",
    icon: FiBriefcase,
    label: "Pengembangan Karier",
    color: "bg-[#F4EED9]",
  },
  {
    number: "03",
    title: "Pengumuman",
    description:
      "Dapatkan informasi terbaru mengenai kegiatan, agenda, dan pengumuman mahasiswa.",
    href: "/informasi/pengumuman",
    icon: FiBell,
    label: "Informasi Terbaru",
    color: "bg-[#EAF0EF]",
  },
  {
    number: "04",
    title: "Merchandise",
    description:
      "Temukan berbagai produk dan merchandise mahasiswa yang tersedia di UNISRI.",
    href: "/merchandise",
    icon: FiShoppingBag,
    label: "Produk Mahasiswa",
    color: "bg-[#F4EED9]",
  },
  {
    number: "05",
    title: "Aduan",
    description:
      "Sampaikan aspirasi, laporan, kritik, dan saran melalui layanan aduan mahasiswa.",
    href: "/aduan",
    icon: FiMessageSquare,
    label: "Suara Mahasiswa",
    color: "bg-[#E9F0E9]",
  },
];

// ============================================
// DATA KEUNGGULAN
// ============================================

const benefits = [
  {
    icon: FiCompass,
    title: "Mudah Diakses",
    description:
      "Berbagai informasi dan layanan mahasiswa dapat ditemukan melalui satu platform.",
  },
  {
    icon: FiUsers,
    title: "Berorientasi Mahasiswa",
    description:
      "Dikembangkan untuk mendukung kebutuhan informasi dan aktivitas mahasiswa UNISRI.",
  },
  {
    icon: FiShield,
    title: "Dikelola BEM KM UNISRI",
    description:
      "Menjadi bagian dari upaya BEM KM UNISRI dalam menyediakan layanan yang bermanfaat bagi mahasiswa.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

// ============================================
// HOME PAGE
// ============================================

export default function Home() {
  return (

    <main className="overflow-hidden bg-white text-[#202820]">

      {/* =====================================
          HERO SECTION
      ====================================== */}

      <section className="relative overflow-hidden bg-white">

        {/* Dekorasi */}
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#1F4B3B]/[0.035] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#D6B36A]/[0.07] blur-3xl" />

        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 lg:px-10 lg:py-20">

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
                Layanan Digital BEM KM UNISRI
              </span>
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-[#1F4B3B] sm:text-5xl lg:text-[62px]">
              Satu Ruang,
              <br />
              Beragam
              <span className="relative ml-2 inline-block">
                Peluang.
                <span className="absolute -bottom-1 left-0 -z-0 h-3 w-full rounded-full bg-[#D6B36A]/35" />
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-gray-600 sm:text-base">
              Selamat datang di AksaleraVerse, platform layanan
              digital mahasiswa Universitas Slamet Riyadi yang
              dikelola oleh BEM KM UNISRI. Temukan informasi,
              peluang pengembangan diri, merchandise, serta
              sampaikan aspirasi melalui satu platform.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                href="/informasi"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#1F4B3B] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#1F4B3B]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#173B2E]"
              >
                Jelajahi Informasi

                <FiArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/aduan"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1F4B3B]/20 bg-white px-7 py-4 text-sm font-bold text-[#1F4B3B] transition-all duration-300 hover:-translate-y-1 hover:border-[#1F4B3B] hover:shadow-md"
              >
                Sampaikan Aduan
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
                Layanan BEM KM UNISRI
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
              animate={{ rotate: 360 }}
              transition={{
                duration: 45,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute h-[300px] w-[300px] rounded-full border border-dashed border-[#1F4B3B]/20 sm:h-[430px] sm:w-[430px] lg:h-[470px] lg:w-[470px]"
            />

            <div className="absolute h-[270px] w-[270px] rounded-full bg-[#1F4B3B]/[0.06] blur-2xl sm:h-[350px] sm:w-[350px]" />

            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full"
            >
              <video
                src="/images/maskot-aksalera.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label="Maskot AksaleraVerse"
                className="mx-auto h-auto max-h-[280px] w-full object-contain drop-shadow-2xl sm:max-h-[330px] lg:max-h-[380px]"
              />
            </motion.div>

            {/* Label Maskot */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-gray-100 bg-white px-5 py-2.5 shadow-lg"
            >
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#1F4B3B]">
                YOUR CAMPUS COMPANION
              </p>
            </motion.div>

            {/* Floating Icon */}

            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute right-0 top-12 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white text-[#1F4B3B] shadow-xl sm:right-2"
            >
              <FiStar size={25} />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-20 left-0 z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F4B3B] text-white shadow-xl sm:left-2"
            >
              <FiBookOpen size={25} />
            </motion.div>

          </motion.div>
        </div>

        <div className="relative h-px w-full bg-gray-100" />
      </section>

      {/* =====================================
          INTRODUCTION SECTION
      ====================================== */}

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center"
        >

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A17C3F]">
              Mengenal AksaleraVerse
            </span>

            <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-[#1F4B3B] sm:text-4xl">
              Layanan Digital untuk Mendukung Kebutuhan Mahasiswa
            </h2>

            <div className="mt-5 h-1.5 w-20 rounded-full bg-[#D6B36A]" />
          </div>

          <div className="space-y-5 text-sm leading-8 text-gray-600 sm:text-base">

            <p>
              AksaleraVerse merupakan platform layanan digital
              mahasiswa Universitas Slamet Riyadi yang dikelola
              oleh Badan Eksekutif Mahasiswa Keluarga Mahasiswa
              Universitas Slamet Riyadi (BEM KM UNISRI).
            </p>

            <p>
              Platform ini menyediakan akses informasi
              beasiswa, peluang magang, pengumuman, merchandise,
              serta layanan aduan untuk memudahkan mahasiswa
              memperoleh informasi dan menyampaikan aspirasi.
            </p>

            <p className="font-semibold text-[#1F4B3B]">
              Hadir sebagai salah satu bentuk layanan BEM KM
              UNISRI yang berorientasi pada kebutuhan mahasiswa.
            </p>

          </div>
        </motion.div>
      </section>

      {/* =====================================
          SERVICES SECTION
      ====================================== */}

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

        <div className="mx-auto max-w-7xl">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A17C3F]">
              Layanan AksaleraVerse
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#1F4B3B] sm:text-4xl">
              Semua Kebutuhan dalam Satu Platform
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
              Jelajahi berbagai layanan yang dikelola oleh
              BEM KM UNISRI untuk mendukung kebutuhan informasi
              dan aktivitas mahasiswa.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.number}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                >
                  <Link
                    href={service.href}
                    className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#1F4B3B]/20 hover:shadow-xl hover:shadow-[#1F4B3B]/5"
                  >

                    <div className="flex items-center justify-between">

                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${service.color} text-[#1F4B3B] transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon size={25} />
                      </div>

                      <span className="text-xs font-bold tracking-widest text-gray-300">
                        {service.number}
                      </span>

                    </div>

                    <span className="mt-7 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A17C3F]">
                      {service.label}
                    </span>

                    <h3 className="mt-2 text-xl font-bold text-[#1F4B3B]">
                      {service.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-7 text-gray-500">
                      {service.description}
                    </p>

                    <div className="mt-7 flex items-center justify-between border-t border-gray-100 pt-5">

                      <span className="text-xs font-bold text-[#1F4B3B]">
                        Jelajahi layanan
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F4EED9] text-[#1F4B3B] transition-all duration-300 group-hover:bg-[#1F4B3B] group-hover:text-white">
                        <FiArrowUpRight size={18} />
                      </span>

                    </div>

                  </Link>
                </motion.div>
              );
            })}

          </div>
        </div>
      </section>

      {/* =====================================
          WHY AKSALERAVERSE
      ====================================== */}

      <section className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">

        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A17C3F]">
              Mengapa AksaleraVerse?
            </span>

            <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-[#1F4B3B] sm:text-4xl">
              Layanan yang Hadir untuk Mahasiswa UNISRI
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-8 text-gray-500 sm:text-base">
              AksaleraVerse menjadi salah satu sarana BEM KM
              UNISRI dalam menghadirkan layanan informasi dan
              komunikasi kemahasiswaan yang lebih terpusat,
              mudah dijangkau, dan praktis digunakan.
            </p>

            <Link
              href="/informasi"
              className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-[#1F4B3B] px-6 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#173B2E]"
            >
              Mulai Jelajahi
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="space-y-4">

            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                  }}
                  className="flex gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[#1F4B3B]/20 hover:shadow-lg"
                >

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-[#1F4B3B]">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-gray-500">
                      {benefit.description}
                    </p>
                  </div>

                </motion.div>
              );
            })}

          </div>
        </div>
      </section>

      {/* =====================================
          FINAL CTA
      ====================================== */}

      <section className="bg-white px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#1F4B3B]/15 bg-white px-7 py-14 text-center shadow-sm sm:px-12 lg:py-20"
        >

          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-[#1F4B3B]/[0.035] blur-2xl" />

          <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[#D6B36A]/[0.08] blur-2xl" />

          <div className="relative z-10 mx-auto max-w-2xl">

            <span className="inline-flex items-center gap-2 rounded-full border border-[#1F4B3B]/15 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1F4B3B]">
              <FiStar size={13} />
              BEM KM UNISRI
            </span>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-[#1F4B3B] sm:text-4xl lg:text-5xl">
              Temukan Peluangmu
              <br />
              Bersama AksaleraVerse
            </h2>

            <p className="mt-5 text-sm leading-8 text-gray-500 sm:text-base">
              Manfaatkan berbagai informasi dan layanan
              kemahasiswaan yang tersedia. Jadikan setiap
              kesempatan sebagai langkah untuk berkembang.
            </p>

            <Link
              href="/informasi"
              className="group mt-9 inline-flex items-center gap-3 rounded-xl bg-[#1F4B3B] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#173B2E]"
            >
              Jelajahi Sekarang
              <FiArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

          </div>
        </motion.div>
      </section>

    </main>
  );
}
