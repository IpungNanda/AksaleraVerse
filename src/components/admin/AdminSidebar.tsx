
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AnimatePresence, motion } from "framer-motion";

import {
  FiGrid,
  FiInfo,
  FiShoppingBag,
  FiBookOpen,
  FiBriefcase,
  FiVolume2,
  FiChevronDown,
  FiGlobe,
  FiLogOut,
  FiX,
  FiShield,
  FiMenu,
} from "react-icons/fi";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const informationMenus = [
  {
    name: "Beasiswa",
    href: "/admin/informasi/beasiswa",
    icon: FiBookOpen,
  },
  {
    name: "Magang",
    href: "/admin/informasi/magang",
    icon: FiBriefcase,
  },
  {
    name: "Pengumuman",
    href: "/admin/informasi/pengumuman",
    icon: FiVolume2,
  },
];

export default function AdminSidebar({
  mobileOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [informationOpen, setInformationOpen] = useState(
    pathname.startsWith("/admin/informasi")
  );

  const [loggingOut, setLoggingOut] = useState(false);

  // Buka submenu otomatis sesuai halaman aktif
  useEffect(() => {
    if (pathname.startsWith("/admin/informasi")) {
      setInformationOpen(true);
    }
  }, [pathname]);

  // Menentukan menu aktif termasuk halaman turunannya
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isInformationActive = pathname.startsWith(
    "/admin/informasi"
  );

  // Logout
  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin keluar dari dashboard?"
    );

    if (!confirmed) return;

    try {
      setLoggingOut(true);

      await signOut(auth);

      onClose();
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);

      window.alert("Gagal keluar. Silakan coba kembali.");
      setLoggingOut(false);
    }
  };

  // Menutup drawer setelah navigasi
  const handleNavigation = () => {
    onClose();
  };

  // Isi sidebar
  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#1F4B3B] text-white">

      {/* BRAND */}
      <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-white/10 px-6">
        <Link
          href="/admin/dashboard"
          onClick={handleNavigation}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#FFFF] p-1.5">
            <img
              src="/images/logo.png"
              alt="AksaleraVerse Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-base font-bold tracking-wide">
              AksaleraVerse
            </h1>

            <p className="text-[10px] tracking-[0.15em] text-[#F4EED9]/65">
              ADMIN PANEL
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup sidebar"
          className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 lg:hidden"
        >
          <FiX size={21} />
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 overflow-y-auto px-4 py-6">

        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F4EED9]/50">
          Menu Utama
        </p>

        <nav className="space-y-2">

          {/* DASHBOARD */}
          <Link
            href="/admin/dashboard"
            onClick={handleNavigation}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/admin/dashboard")
                ? "bg-[#F4EED9] text-[#1F4B3B] shadow-lg"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FiGrid size={19} />

            <span className="flex-1">Dashboard</span>

            {isActive("/admin/dashboard") && (
              <span className="h-2 w-2 rounded-full bg-[#1F4B3B]" />
            )}
          </Link>

          {/* INFORMASI */}
          <div>
            <button
              type="button"
              onClick={() =>
                setInformationOpen((previous) => !previous)
              }
              aria-expanded={informationOpen}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isInformationActive
                  ? "bg-white/10 text-[#F4EED9]"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <FiInfo size={19} />

              <span className="flex-1 text-left">
                Informasi
              </span>

              <FiChevronDown
                size={17}
                className={`transition-transform duration-200 ${
                  informationOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* SUBMENU INFORMASI */}
            <AnimatePresence initial={false}>
              {informationOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="ml-6 mt-2 space-y-1 border-l border-white/20 pl-4">

                    {informationMenus.map((menu) => {
                      const Icon = menu.icon;
                      const active = isActive(menu.href);

                      return (
                        <Link
                          key={menu.href}
                          href={menu.href}
                          onClick={handleNavigation}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-all ${
                            active
                              ? "bg-[#F4EED9] font-semibold text-[#1F4B3B]"
                              : "text-white/65 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon size={16} />

                          <span>{menu.name}</span>
                        </Link>
                      );
                    })}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MERCHANDISE */}
          <Link
            href="/admin/merchandise"
            onClick={handleNavigation}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              isActive("/admin/merchandise")
                ? "bg-[#F4EED9] text-[#1F4B3B] shadow-lg"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FiShoppingBag size={19} />

            <span className="flex-1">UNISRI Merchandise</span>
          </Link>

        </nav>

        {/* LAINNYA */}
        <div className="mb-4 mt-9">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#F4EED9]/50">
            Lainnya
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
        >
          <FiGlobe size={19} />

          <span>Lihat Website</span>
        </Link>

      </div>

      {/* PROFILE & LOGOUT */}
      <div className="shrink-0 border-t border-white/10 p-4">

        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/10 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4EED9] text-[#1F4B3B]">
            <FiShield size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              Administrator
            </p>

            <p className="text-[11px] text-white/55">
              AksaleraVerse Admin
            </p>
          </div>

          <span className="h-2 w-2 rounded-full bg-green-400" />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-200 transition hover:bg-red-500/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiLogOut size={19} />

          {loggingOut ? "Keluar..." : "Keluar"}
        </button>

        <p className="mt-4 text-center text-[10px] text-white/35">
          © {new Date().getFullYear()} AksaleraVerse
        </p>

      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] lg:block">
        {sidebarContent}
      </aside>

      {/* MOBILE OVERLAY & DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] lg:hidden"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] shadow-2xl lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
