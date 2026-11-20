
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  FiArrowLeft,
  FiEdit2,
  FiCalendar,
  FiExternalLink,
  FiRefreshCw,
  FiBookOpen,
  FiUser,
  FiCheckCircle,
} from "react-icons/fi";

import {
  getBeasiswaById,
  type Beasiswa,
} from "@/lib/beasiswa";

export default function DetailBeasiswaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<Beasiswa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getBeasiswaById(params.id);
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <FiRefreshCw
          size={28}
          className="animate-spin text-[#1F4B3B]"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <h2 className="font-bold text-[#1F4B3B]">
          Beasiswa tidak ditemukan.
        </h2>

        <button
          onClick={() => router.push("/admin/informasi/beasiswa")}
          className="mt-4 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  const statusStyle = {
    aktif: "bg-green-50 text-green-700",
    draft: "bg-gray-100 text-gray-600",
    ditutup: "bg-red-50 text-red-600",
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs text-gray-400">
            Informasi / Beasiswa / Detail
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#1F4B3B]">
            Detail Beasiswa
          </h1>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/informasi/beasiswa"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600"
          >
            <FiArrowLeft />
            Kembali
          </Link>

          <Link
            href={`/admin/informasi/beasiswa/edit/${data.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F4B3B] px-4 py-3 text-sm font-semibold text-white"
          >
            <FiEdit2 />
            Edit
          </Link>
        </div>
      </div>

      {/* MAIN DETAIL */}
      <section className="overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white">

        {/* POSTER */}
        {data.gambar && (
          <div className="bg-[#F8F9F7] p-5 sm:p-8">
            <img
              src={data.gambar}
              alt={data.judul}
              className="mx-auto max-h-[450px] w-full rounded-xl object-contain"
            />
          </div>
        )}

        {/* CONTENT */}
        <div className="space-y-7 p-6 sm:p-8">

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusStyle[data.status]}`}>
                {data.status}
              </span>

              <span className="text-xs text-gray-400">
                ID: {data.id}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-bold leading-tight text-[#1F4B3B] sm:text-3xl">
              {data.judul}
            </h2>

            <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
              <FiUser className="text-[#1F4B3B]" />
              {data.penyelenggara}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-xl bg-[#F8F9F7] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1F4B3B]">
                <FiCalendar />
                Tanggal Mulai
              </div>

              <p className="mt-3 text-sm text-gray-600">
                {data.tanggalMulai || "-"}
              </p>
            </div>

            <div className="rounded-xl bg-[#F8F9F7] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1F4B3B]">
                <FiCalendar />
                Batas Pendaftaran
              </div>

              <p className="mt-3 text-sm text-gray-600">
                {data.tanggalSelesai || "-"}
              </p>
            </div>

          </div>

          <div>
            <h3 className="flex items-center gap-2 font-bold text-[#1F4B3B]">
              <FiBookOpen />
              Deskripsi Beasiswa
            </h3>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
              {data.deskripsi || "-"}
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 font-bold text-[#1F4B3B]">
              <FiCheckCircle />
              Persyaratan
            </h3>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
              {data.persyaratan || "-"}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#1F4B3B]">
              Manfaat Beasiswa
            </h3>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
              {data.manfaat || "-"}
            </p>
          </div>

          {data.linkPendaftaran && (
            <div className="border-t border-gray-100 pt-6">
              <a
                href={data.linkPendaftaran}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17392D]"
              >
                Buka Link Pendaftaran
                <FiExternalLink />
              </a>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
