
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCalendar,
  FiExternalLink,
  FiFileText,
  FiLoader,
  FiAlertCircle,
  FiInfo,
  FiBell,
} from "react-icons/fi";
import {
  getPengumumanById,
  type Pengumuman,
} from "@/lib/pengumuman";

function formatTanggal(tanggal?: string) {
  if (!tanggal) return "-";

  const date = new Date(`${tanggal}T00:00:00`);

  if (Number.isNaN(date.getTime())) return tanggal;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function DetailPengumumanPage() {
  const params = useParams();
  const id = params.id as string;

  const [pengumuman, setPengumuman] = useState<Pengumuman | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        setError("");

        const data = await getPengumumanById(id);

        if (!data) {
          setError("Informasi pengumuman tidak ditemukan.");
          return;
        }

        if (data.status !== "aktif") {
          setError("Pengumuman ini belum tersedia untuk publik.");
          return;
        }

        setPengumuman(data);
      } catch (err) {
        console.error("Gagal mengambil detail pengumuman:", err);
        setError("Terjadi kesalahan saat mengambil informasi pengumuman.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadDetail();
    }
  }, [id]);

  // Loading
  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-white px-5">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4EED9]">
            <FiLoader className="animate-spin text-2xl text-[#1F4B3B]" />
          </div>

          <div>
            <p className="font-semibold text-[#202820]">
              Memuat pengumuman
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Mohon tunggu sebentar...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Error / Not Found
  if (error || !pengumuman) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-white px-5 py-16">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <FiAlertCircle className="text-3xl text-red-500" />
          </div>

          <h1 className="text-xl font-bold text-[#202820] sm:text-2xl">
            Pengumuman Tidak Ditemukan
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            {error || "Pengumuman yang kamu cari tidak tersedia."}
          </p>

          <Link
            href="/informasi/pengumuman"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F4B3B] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#17392D] sm:w-auto"
          >
            <FiArrowLeft />
            Kembali ke Pengumuman
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-16 sm:pb-20">
      {/* Header */}
      <section className="border-b border-[#E8EDE8] bg-[#F4EED9]/40">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
          <Link
            href="/informasi"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#1F4B3B] transition hover:gap-3"
          >
            <FiArrowLeft />
            Kembali ke Daftar Pengumuman
          </Link>

          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1F4B3B]/10 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#1F4B3B] sm:text-xs">
              <FiBell />
              Pengumuman Resmi
            </span>

            <h1 className="mt-5 break-words text-2xl font-extrabold leading-tight text-[#202820] sm:text-3xl md:text-4xl lg:text-5xl">
              {pengumuman.judul}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#1F4B3B]" />
                <span>
                  {formatTanggal(pengumuman.tanggalPublikasi)}
                </span>
              </div>

              <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                Dipublikasikan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-7 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10 lg:px-10 lg:py-14">
        {/* Main Article */}
        <article className="min-w-0">
          {/* Gambar */}
          {pengumuman.gambar && (
            <div className="mb-7 overflow-hidden rounded-2xl border border-[#E8EDE8] bg-[#F4EED9]/30 sm:mb-9 sm:rounded-3xl">
              <img
                src={pengumuman.gambar}
                alt={pengumuman.judul}
                className="max-h-[500px] min-h-[180px] w-full object-contain sm:min-h-[260px]"
              />
            </div>
          )}

          {/* Isi Pengumuman */}
          <div className="rounded-2xl border border-[#E8EDE8] bg-white p-5 sm:rounded-3xl sm:p-8 lg:p-10">
            <div className="mb-6 flex items-center gap-3 border-b border-[#E8EDE8] pb-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                <FiFileText className="text-xl" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#202820] sm:text-xl">
                  Isi Pengumuman
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Informasi resmi AksaleraVerse
                </p>
              </div>
            </div>

            <div className="whitespace-pre-line break-words text-sm leading-8 text-gray-600 sm:text-base sm:leading-9">
              {pengumuman.isi || "Belum ada isi pengumuman."}
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="min-w-0 lg:sticky lg:top-8">
          <div className="overflow-hidden rounded-2xl border border-[#E8EDE8] bg-white shadow-sm sm:rounded-3xl">
            <div className="bg-[#1F4B3B] px-5 py-5 text-white sm:px-6 sm:py-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Informasi
              </p>

              <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                Detail Pengumuman
              </h2>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                  <FiCalendar />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-500">
                    Tanggal Publikasi
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#202820]">
                    {formatTanggal(pengumuman.tanggalPublikasi)}
                  </p>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-gray-200" />

              <div className="rounded-2xl bg-[#F4EED9]/50 p-4">
                <div className="flex items-start gap-3">
                  <FiInfo className="mt-1 shrink-0 text-lg text-[#1F4B3B]" />
                  <p className="text-xs leading-6 text-gray-600">
                    Pastikan kamu membaca seluruh informasi pengumuman
                    agar tidak melewatkan hal-hal penting.
                  </p>
                </div>
              </div>

              {pengumuman.linkTerkait && (
                <a
                  href={pengumuman.linkTerkait}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#1F4B3B] px-5 py-3.5 text-sm font-bold text-white transition duration-200 hover:bg-[#17392D] hover:shadow-lg"
                >
                  Informasi Selengkapnya
                  <FiExternalLink />
                </a>
              )}
            </div>
          </div>
        </aside>
      </section>

      {/* Back Navigation */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="border-t border-[#E8EDE8] pt-7">
          <Link
            href="/informasi"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#1F4B3B] transition hover:gap-3"
          >
            <FiArrowLeft />
            Kembali ke Daftar Pengumuman
          </Link>
        </div>
      </section>
    </main>
  );
}
