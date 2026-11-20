
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiEdit, FiExternalLink } from "react-icons/fi";

import { checkAdminPermission } from "@/lib/auth";
import {
  getPengumumanById,
  type Pengumuman,
} from "@/lib/pengumuman";

export default function DetailPengumumanPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<Pengumuman | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await checkAdminPermission();
        const result = await getPengumumanById(params.id);
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
    return <div className="p-10 text-center">Memuat pengumuman...</div>;
  }

  if (!data) {
    return (
      <div className="rounded-xl bg-red-50 p-5 text-red-700">
        Pengumuman tidak ditemukan.
      </div>
    );
  }

  const statusStyle =
    data.status === "aktif"
      ? "bg-green-100 text-green-700"
      : data.status === "ditutup"
        ? "bg-red-100 text-red-700"
        : "bg-yellow-100 text-yellow-700";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/admin/informasi/pengumuman"
            className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1F4B3B]"
          >
            <FiArrowLeft /> Kembali
          </Link>
          <h1 className="text-2xl font-bold text-[#1F4B3B]">
            Detail Pengumuman
          </h1>
        </div>

        <Link
          href={`/admin/informasi/pengumuman/edit/${data.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#17392D]"
        >
          <FiEdit /> Edit Pengumuman
        </Link>
      </div>

      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {data.gambar && (
          <div className="relative aspect-video w-full bg-gray-100">
            <Image
              src={data.gambar}
              alt={data.judul}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-5 p-5 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}>
              {data.status}
            </span>
            <span className="text-sm text-gray-500">
              {data.tanggalPublikasi}
            </span>
          </div>

          <h2 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
            {data.judul}
          </h2>

          <div className="whitespace-pre-wrap break-words text-sm leading-8 text-gray-700">
            {data.isi}
          </div>

          {data.linkTerkait && (
            <a
              href={data.linkTerkait}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#F4EED9] px-4 py-3 text-sm font-semibold text-[#1F4B3B] hover:bg-[#EDE3C4]"
            >
              Buka Link Terkait <FiExternalLink />
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
