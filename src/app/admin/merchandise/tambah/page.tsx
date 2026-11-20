"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import { checkAdminPermission } from "@/lib/auth";
import MerchandiseForm from "@/components/admin/MerchandiseForm";

export default function TambahMerchandisePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    checkAdminPermission()
      .then(() => {
        if (active) setAuthorized(true);
      })
      .catch(() => {
        if (active) router.replace("/admin/login");
      });

    return () => {
      active = false;
    };
  }, [router]);

  if (!authorized) {
    return <div className="p-10 text-center">Memeriksa akses admin...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          href="/admin/merchandise"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1F4B3B]"
        >
          <FiArrowLeft /> Kembali ke Merchandise
        </Link>
        <h1 className="text-2xl font-bold text-[#1F4B3B]">
          Tambah Produk Merchandise
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Masukkan informasi produk dan nomor WhatsApp penjual.
        </p>
      </div>

      <MerchandiseForm mode="create" />
    </div>
  );
}
