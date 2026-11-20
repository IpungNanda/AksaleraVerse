
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiMenu,
  FiBell,
  FiChevronRight,
} from "react-icons/fi";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface AdminLayoutShellProps {
  children: React.ReactNode;
}

export default function AdminLayoutShell({
  children,
}: AdminLayoutShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Halaman login tidak menggunakan sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const getPageTitle = () => {
    if (pathname === "/admin/dashboard") return "Dashboard";
    if (pathname.includes("/beasiswa")) return "Informasi Beasiswa";
    if (pathname.includes("/magang")) return "Informasi Magang";
    if (pathname.includes("/pengumuman")) return "Pengumuman";
    if (pathname.includes("/informasi")) return "Informasi";
    if (pathname.includes("/merchandise")) return "UNISRI Merchandise";

    return "Administrator";
  };

  return (
    <div className="min-h-screen bg-[#F8F9F7]">

      {/* SIDEBAR */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* MAIN CONTENT */}
      <div className="min-h-screen lg:pl-[270px]">

        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#E8EDE9] bg-white/95 px-5 backdrop-blur-md sm:px-8">

          <div className="flex items-center gap-3">

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl bg-[#F4EED9] p-2.5 text-[#1F4B3B] transition hover:bg-[#EAE2C8] lg:hidden"
              aria-label="Buka menu"
            >
              <FiMenu size={21} />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Admin</span>
                <FiChevronRight size={12} />
                <span className="font-medium text-[#1F4B3B]">
                  {getPageTitle()}
                </span>
              </div>

              <h2 className="mt-1 text-lg font-bold text-[#1F4B3B]">
                {getPageTitle()}
              </h2>
            </div>
          </div>

          {/* HEADER RIGHT */}
          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#1F4B3B]">
                Administrator
              </p>
              <p className="text-[11px] text-gray-400">
                AksaleraVerse
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4EED9] text-[#1F4B3B]">
              <FiBell size={19} />
            </div>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-[calc(100vh-72px)] p-5 sm:p-8"
        >
          {children}
        </motion.main>

      </div>
    </div>
  );
}
