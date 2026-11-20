
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiRefreshCw } from "react-icons/fi";

import BeasiswaForm from "@/components/admin/beasiswa/BeasiswaForm";
import {
  getBeasiswaById,
  type Beasiswa,
} from "@/lib/beasiswa";

export default function EditBeasiswaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<Beasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getBeasiswaById(params.id);

        if (!result) {
          setError("Data beasiswa tidak ditemukan.");
          return;
        }

        setData(result);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data beasiswa.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <FiRefreshCw size={28} className="animate-spin text-[#1F4B3B]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <h2 className="font-bold text-[#1F4B3B]">
          {error || "Data tidak ditemukan"}
        </h2>

        <button
          onClick={() => router.push("/admin/informasi/beasiswa")}
          className="mt-4 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm text-white"
        >
          Kembali ke Beasiswa
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-xs text-gray-400">
          Informasi / Beasiswa / Edit
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#1F4B3B]">
          Edit Beasiswa
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Perbarui informasi beasiswa yang sudah tersimpan.
        </p>
      </div>

      <BeasiswaForm mode="edit" initialData={data} />
    </div>
  );
}
