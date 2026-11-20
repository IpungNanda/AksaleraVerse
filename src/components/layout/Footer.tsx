
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiMail,
  FiMapPin,
  FiInstagram,
  FiArrowUp,
  FiHeart,
  FiExternalLink,
} from "react-icons/fi";

const navigationLinks = [
  { name: "Beranda", href: "/" },
  { name: "Merchandise", href: "/merchandise" },
  { name: "Aduan", href: "/aduan" },
];

const informationLinks = [
  { name: "Beasiswa", href: "/informasi" },
  { name: "Magang", href: "/informasi" },
  { name: "Pengumuman", href: "/informasi" },
];

const footerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative isolate overflow-hidden bg-[#1F4B3B] text-white">
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-80 w-80 rounded-full bg-[#F4EED9]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-96 w-96 rounded-full bg-[#D6B36A]/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* MAIN FOOTER */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-12 lg:gap-10 lg:py-16"
        >
          {/* BRAND */}
          <motion.div
            variants={footerVariants}
            transition={{ duration: 0.6 }}
            className="sm:col-span-2 lg:col-span-5"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FFFF] shadow-md transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/images/logo.png"
                  alt="Logo AksaleraVerse"
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  AksaleraVerse
                </h2>
                <p className="mt-0.5 text-[9px] font-semibold tracking-[0.2em] text-white/55 sm:text-[10px]">
                  STUDENT INFORMATION PLATFORM
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/70">
              AksaleraVerse merupakan platform informasi mahasiswa
              Universitas Slamet Riyadi yang menghadirkan berbagai
              informasi beasiswa, peluang magang, pengumuman,
              merchandise, serta layanan aduan dalam satu tempat.
            </p>

            {/* SOCIAL MEDIA */}
            <div className="mt-7">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#F4EED9]">
                Ikuti Media Sosial Kami
              </p>

              <motion.a
                href="https://www.instagram.com/bemkmunisri/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex max-w-full items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-3 transition-colors hover:border-[#F4EED9]/40 hover:bg-white/10"
                aria-label="Instagram BEM KM UNISRI"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                  <FiInstagram size={23} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    Instagram
                  </p>
                  <p className="mt-0.5 text-xs text-white/55">
                    @bemkmunisri
                  </p>
                </div>

                <FiExternalLink
                  size={17}
                  className="ml-3 shrink-0 text-white/50 transition-all group-hover:translate-x-1 group-hover:text-[#F4EED9]"
                />
              </motion.a>
            </div>
          </motion.div>

          {/* NAVIGATION */}
          <motion.div
            variants={footerVariants}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 lg:col-start-7"
          >
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-[#F4EED9]">
              Navigasi
              <span className="h-px flex-1 bg-white/15 sm:hidden" />
            </h3>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-1">
              {navigationLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors duration-300 hover:text-[#F4EED9]"
                  >
                    <span>{item.name}</span>
                    <FiArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* INFORMATION */}
          <motion.div
            variants={footerVariants}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-[#F4EED9]">
              Informasi
              <span className="h-px flex-1 bg-white/15 sm:hidden" />
            </h3>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-1">
              {informationLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors duration-300 hover:text-[#F4EED9]"
                  >
                    <span>{item.name}</span>
                    <FiArrowUpRight
                      size={14}
                      className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CONTACT */}
          <motion.div
            variants={footerVariants}
            transition={{ duration: 0.6 }}
            className="sm:col-span-2 lg:col-span-3"
          >
            <h3 className="mb-6 flex items-center gap-2 text-sm font-bold text-[#F4EED9]">
              Hubungi Kami
              <span className="h-px flex-1 bg-white/15 sm:hidden" />
            </h3>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              {/* EMAIL */}
              <a
                href="mailto:pp.aksalera2026@gmail.com"
                className="group flex items-start gap-3 rounded-xl transition-colors hover:bg-white/5 sm:p-2 sm:-m-2"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#F4EED9] transition-colors group-hover:bg-[#F4EED9] group-hover:text-[#1F4B3B]">
                  <FiMail size={18} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-white/45">
                    Email Aduan
                  </p>
                  <p className="mt-1 break-all text-sm text-white/80 transition-colors group-hover:text-[#F4EED9]">
                    pp.aksalera2026@gmail.com
                  </p>
                </div>
              </a>

              {/* LOCATION */}
              <div className="flex items-start gap-3 rounded-xl sm:p-2 sm:-m-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#F4EED9]">
                  <FiMapPin size={18} />
                </div>

                <div>
                  <p className="text-xs text-white/45">
                    Lokasi
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/80">
                    Universitas Slamet Riyadi
                    <br />
                    Surakarta, Jawa Tengah
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* FOOTER BOTTOM */}
        <div className="border-t border-white/15 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-relaxed text-white/55">
              © {currentYear} AksaleraVerse. All rights reserved.
            </p>

            <p className="flex items-center gap-1.5 text-xs text-white/55">
              Developed with
              for UNISRI Students
            </p>

            <motion.button
              type="button"
              onClick={scrollToTop}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 text-[#F4EED9] transition-colors duration-300 hover:border-[#F4EED9] hover:bg-[#F4EED9] hover:text-[#1F4B3B]"
              aria-label="Kembali ke atas"
            >
              <FiArrowUp size={19} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
