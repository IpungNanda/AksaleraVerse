
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiHome,
  FiInfo,
  FiShoppingBag,
  FiMessageSquare,
  FiMenu,
  FiX,
} from "react-icons/fi";

const navigationLinks = [
  {
    name: "Beranda",
    href: "/",
    icon: FiHome,
  },
  {
    name: "Informasi",
    href: "/informasi",
    icon: FiInfo,
  },
  {
    name: "Merchandise",
    href: "/merchandise",
    icon: FiShoppingBag,
  },
  {
    name: "Aduan",
    href: "/aduan",
    icon: FiMessageSquare,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => {
    setMobileOpen(false);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1F4B3B]/10 bg-white/95 shadow-sm shadow-[#1F4B3B]/5 backdrop-blur-xl">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
      >
        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-[#FFFF]">
            <Image
              src="/images/logo.png"
              alt="Logo AksaleraVerse"
              fill
              sizes="44px"
              className="object-contain p-1"
              priority
            />
          </div>

          <div className="leading-tight">
            <span className="text-lg font-bold tracking-tight text-[#1F4B3B] sm:text-xl">
              AksaleraVerse
            </span>

            <span className="mt-1 block text-[9px] font-medium tracking-[0.17em] text-gray-500">
              STUDENT INFORMATION PLATFORM
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isActive(item.href)
                  ? "bg-[#F4EED9] text-[#1F4B3B]"
                  : "text-gray-600 hover:bg-[#F4EED9]/70 hover:text-[#1F4B3B]"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#1F4B3B]/10 text-[#1F4B3B] transition-colors hover:bg-[#F4EED9] lg:hidden"
        >
          {mobileOpen ? <FiX size={23} /> : <FiMenu size={23} />}
        </button>
      </nav>

      {/* MOBILE NAVIGATION */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* BACKDROP */}
            <motion.button
              type="button"
              aria-label="Tutup menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 top-[76px] z-40 bg-black/30 lg:hidden"
            />

            {/* MOBILE PANEL */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full z-50 max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-gray-100 bg-white px-5 pb-7 pt-4 shadow-xl lg:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-2">
                {navigationLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-colors ${
                        active
                          ? "bg-[#F4EED9] text-[#1F4B3B]"
                          : "text-gray-600 hover:bg-[#F4EED9]/70 hover:text-[#1F4B3B]"
                      }`}
                    >
                      <Icon size={19} />
                      {item.name}
                    </Link>
                  );
                })}

                {/* MOBILE WELCOME */}
                <div className="mt-3 rounded-xl bg-[#1F4B3B] p-4">
                  <p className="text-sm font-semibold text-white">
                    Selamat datang di AksaleraVerse
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-white/75">
                    Temukan informasi, peluang, dan kebutuhan mahasiswa
                    UNISRI dalam satu platform.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
