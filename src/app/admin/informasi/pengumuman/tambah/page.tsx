
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";

import { checkAdminPermission } from "@/lib/auth";
import PengumumanForm from "@/components/admin/PengumumanForm";

export default function TambahPengumumanPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAdminPermission()
      .then(() => setAuthorized(true))
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  if (!authorized) {
    return (
      <div className="p-10 text-center text-sm text-gray-500">
        Memeriksa akses admin...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/informasi/pengumuman"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1F4B3B]"
        >
          <FiArrowLeft /> Kembali ke Pengumuman
        </Link>
        <h1 className="text-2xl font-bold text-[#1F4B3B]">
          Tambah Pengumuman
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Lengkapi informasi pengumuman di bawah ini.
        </p>
      </div>

      <PengumumanForm mode="create" />
    </div>
  );
}
