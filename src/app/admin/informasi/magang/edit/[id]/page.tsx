
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiAlertCircle, FiLoader, FiArrowLeft } from "react-icons/fi";

import {
  getMagangById,
  type Magang,
} from "@/lib/magang";

import MagangForm from "@/components/admin/magang/MagangForm";

export default function EditMagangPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [data, setData] = useState<Magang | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const result = await getMagangById(id);

        if (!active) return;

        if (!result) {
          setError("Data Magang tidak ditemukan.");
          return;
        }

        setData(result);
      } catch (err) {
        console.error("Edit Magang:", err);

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data Magang."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (id) void loadData();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <FiLoader className="animate-spin text-3xl text-[#1F4B3B]" />
        <p className="text-sm text-gray-500">Memuat data Magang...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-6 text-center">
        <FiAlertCircle className="mx-auto text-3xl text-red-500" />
        <h2 className="mt-3 font-bold text-[#1F4B3B]">
          Data tidak tersedia
        </h2>
        <p className="mt-2 break-words text-sm text-gray-500">
          {error || "Data Magang tidak ditemukan."}
        </p>

        <Link
          href="/admin/informasi/magang"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white"
        >
          <FiArrowLeft />
          Kembali ke Magang
        </Link>
      </div>
    );
  }

  return (
    <MagangForm mode="edit" initialData={data} />
  );
}
