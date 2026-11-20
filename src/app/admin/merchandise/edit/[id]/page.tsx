"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import { checkAdminPermission } from "@/lib/auth";
import {
  getMerchandiseById,
  type Merchandise,
} from "@/lib/merchandise";
import MerchandiseForm from "@/components/admin/MerchandiseForm";

export default function EditMerchandisePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [data, setData] = useState<Merchandise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        if (!id) {
          if (active) setError("ID produk tidak ditemukan.");
          return;
        }

        await checkAdminPermission();
        const result = await getMerchandiseById(id);

        if (!active) return;

        if (!result) {
          setError("Produk merchandise tidak ditemukan.");
          return;
        }

        setData(result);
      } catch (err) {
        console.error("Gagal memuat data merchandise:", err);
        if (active) router.replace("/admin/login");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadData();
    return () => {
      active = false;
    };
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4EED9] text-[#1F4B3B]">
          <FiRefreshCw size={25} className="animate-spin" />
        </div>
        <p className="text-sm font-medium text-gray-500">
          Memuat data merchandise...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center rounded-2xl border border-[#E8EDE9] bg-white p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <FiAlertCircle size={30} />
        </div>
        <h2 className="mt-5 text-xl font-bold text-[#1F4B3B]">
          Produk Tidak Ditemukan
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {error || "Data merchandise tidak tersedia."}
        </p>
        <Link
          href="/admin/merchandise"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17392D]"
        >
          <FiArrowLeft size={17} />
          Kembali ke Merchandise
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-5xl space-y-6 pb-10"
    >
      <div>
        <Link
          href={`/admin/merchandise/detail/${data.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#1F4B3B]"
        >
          <FiArrowLeft size={16} />
          Kembali ke Detail Produk
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-400">
          <span>Merchandise</span>
          <span>/</span>
          <span>Edit Produk</span>
        </div>

        <h1 className="mt-2 text-2xl font-bold text-[#1F4B3B]">
          Edit Merchandise
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Perbarui informasi produk, harga, stok, foto, dan nomor WhatsApp penjual.
        </p>
      </div>

      <MerchandiseForm mode="edit" initialData={data} />
    </motion.div>
  );
}
