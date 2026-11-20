
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiEdit2,
  FiCalendar,
  FiBriefcase,
  FiMapPin,
  FiExternalLink,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import {
  getMagangById,
  type Magang,
} from "@/lib/magang";

const statusStyle = {
  draft: "bg-gray-100 text-gray-600",
  aktif: "bg-green-100 text-green-700",
  ditutup: "bg-red-100 text-red-600",
};

function formatDate(date: string) {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function TextList({ value }: { value: string }) {
  const items = value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length === 0) {
    return <p className="text-sm text-gray-400">Belum ada informasi.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2 text-sm leading-relaxed text-gray-600">
          <FiCheckCircle className="mt-1 shrink-0 text-[#1F4B3B]" />
          <span>{item.replace(/^[-•]\s*/, "")}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DetailMagangPage() {
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
        const result = await getMagangById(id);

        if (!active) return;

        if (!result) {
          setError("Informasi Magang tidak ditemukan.");
        } else {
          setData(result);
        }
      } catch (err) {
        console.error("Detail Magang:", err);

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil detail Magang."
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
        <p className="text-sm text-gray-500">Memuat detail Magang...</p>
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-6 text-center">
        <FiAlertCircle className="mx-auto text-3xl text-red-500" />
        <h2 className="mt-3 font-bold text-[#1F4B3B]">
          Informasi tidak tersedia
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {error || "Data Magang tidak ditemukan."}
        </p>
        <Link
          href="/admin/informasi/magang"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white"
        >
          <FiArrowLeft />
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 space-y-5 pb-8">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Informasi / Magang / Detail
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#1F4B3B] sm:text-3xl">
            Detail Magang
          </h1>
        </div>

        <div className="flex flex-col gap-2 min-[420px]:flex-row">
          <Link
            href="/admin/informasi/magang"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600"
          >
            <FiArrowLeft />
            Kembali
          </Link>

          <Link
            href={`/admin/informasi/magang/edit/${data.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-4 py-3 text-sm font-semibold text-white"
          >
            <FiEdit2 />
            Edit Magang
          </Link>
        </div>
      </div>

      {/* KONTEN DETAIL */}
      <div className="overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white shadow-sm">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[340px_minmax(0,1fr)]">
          {/* POSTER */}
          <div className="flex items-start justify-center bg-[#FAFBF9] p-4 sm:p-6 lg:border-r lg:border-gray-100">
            <img
              src={data.gambar}
              alt={data.judul}
              className="max-h-[480px] w-full rounded-xl object-contain"
            />
          </div>

          {/* INFORMASI */}
          <div className="min-w-0 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#F4EED9] px-3 py-1 text-xs font-semibold text-[#1F4B3B]">
                Informasi Magang
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusStyle[data.status] || statusStyle.draft
                }`}
              >
                {data.status || "draft"}
              </span>
            </div>

            <h2 className="mt-4 break-words text-2xl font-bold leading-tight text-[#1F4B3B] sm:text-3xl">
              {data.judul}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {data.penyelenggara}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-[#FAFBF9] p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <FiBriefcase />
                  Posisi
                </div>
                <p className="mt-2 text-sm font-semibold text-[#1F4B3B]">
                  {data.posisi}
                </p>
              </div>

              <div className="rounded-xl bg-[#FAFBF9] p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <FiMapPin />
                  Lokasi
                </div>
                <p className="mt-2 break-words text-sm font-semibold text-[#1F4B3B]">
                  {data.lokasi}
                </p>
              </div>

              <div className="rounded-xl bg-[#FAFBF9] p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                  <FiCalendar />
                  Periode
                </div>
                <p className="mt-2 text-sm font-semibold text-[#1F4B3B]">
                  {formatDate(data.tanggalMulai)} – {formatDate(data.tanggalSelesai)}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <h3 className="font-bold text-[#1F4B3B]">
                Deskripsi Program
              </h3>
              <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-gray-600">
                {data.deskripsi}
              </p>
            </div>

            <div className="mt-7">
              <h3 className="font-bold text-[#1F4B3B]">
                Persyaratan
              </h3>
              <div className="mt-3">
                <TextList value={data.persyaratan} />
              </div>
            </div>

            <div className="mt-7">
              <h3 className="font-bold text-[#1F4B3B]">
                Manfaat Magang
              </h3>
              <div className="mt-3">
                <TextList value={data.manfaat} />
              </div>
            </div>

            {data.linkPendaftaran && (
              <div className="mt-8">
                <a
                  href={data.linkPendaftaran}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#17392D] sm:w-auto"
                >
                  <FiExternalLink />
                  Buka Link Pendaftaran
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
