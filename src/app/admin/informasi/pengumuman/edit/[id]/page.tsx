
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import { checkAdminPermission } from "@/lib/auth";
import {
  getPengumumanById,
  type Pengumuman,
} from "@/lib/pengumuman";
import PengumumanForm from "@/components/admin/PengumumanForm";

export default function EditPengumumanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<Pengumuman | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        await checkAdminPermission();

        const result = await getPengumumanById(params.id);

        if (!result) {
          setError("Pengumuman tidak ditemukan.");
          return;
        }

        setData(result);
      } catch {
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [params.id, router]);

  if (loading) {
    return <div className="p-10 text-center">Memuat data...</div>;
  }

  if (error || !data) {
    return (
      <div className="rounded-xl bg-red-50 p-5 text-red-700">
        {error || "Pengumuman tidak ditemukan."}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href={`/admin/informasi/pengumuman/detail/${params.id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1F4B3B]"
        >
          <FiArrowLeft /> Kembali ke Detail
        </Link>
        <h1 className="text-2xl font-bold text-[#1F4B3B]">
          Edit Pengumuman
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Perbarui informasi pengumuman.
        </p>
      </div>

      <PengumumanForm mode="edit" initialData={data} />
    </div>
  );
}
