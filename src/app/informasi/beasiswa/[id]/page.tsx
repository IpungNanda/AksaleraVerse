
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCalendar,
  FiExternalLink,
  FiCheckCircle,
  FiGift,
  FiFileText,
  FiLoader,
  FiAlertCircle,
  FiBookOpen,
} from "react-icons/fi";
import { getBeasiswaById, type Beasiswa } from "@/lib/beasiswa";

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

function DetailSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E8EDE8] bg-white p-5 sm:p-7">
      <div className="mb-5 flex items-center gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B] sm:h-12 sm:w-12">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-[#202820] sm:text-xl">
          {title}
        </h2>
      </div>

      <div className="whitespace-pre-line break-words text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
        {children}
      </div>
    </section>
  );
}

export default function DetailBeasiswaPage() {
  const params = useParams();
  const id = params.id as string;

  const [beasiswa, setBeasiswa] = useState<Beasiswa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDetail() {
      try {
        setLoading(true);
        setError("");

        const data = await getBeasiswaById(id);

        if (!data) {
          setError("Informasi beasiswa tidak ditemukan.");
          return;
        }

        setBeasiswa(data);
      } catch (err) {
        console.error("Gagal mengambil detail beasiswa:", err);
        setError("Terjadi kesalahan saat mengambil informasi beasiswa.");
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
              Memuat informasi beasiswa
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
  if (error || !beasiswa) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-white px-5 py-16">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-7 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <FiAlertCircle className="text-3xl text-red-500" />
          </div>

          <h1 className="text-xl font-bold text-[#202820] sm:text-2xl">
            Informasi Tidak Ditemukan
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            {error || "Informasi beasiswa yang kamu cari tidak tersedia."}
          </p>

          <Link
            href="/informasi"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F4B3B] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#17392D] sm:w-auto"
          >
            <FiArrowLeft />
            Kembali ke Beasiswa
          </Link>
        </div>
      </main>
    );
  }

  const statusLabel =
    beasiswa.status === "aktif"
      ? "Pendaftaran Aktif"
      : beasiswa.status === "ditutup"
        ? "Pendaftaran Ditutup"
        : "Draft";

  const statusColor =
    beasiswa.status === "aktif"
      ? "border-green-200 bg-green-50 text-green-700"
      : beasiswa.status === "ditutup"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-gray-200 bg-gray-50 text-gray-600";

  return (
    <main className="min-h-screen bg-white pb-16 sm:pb-20">
      {/* Header */}
      <section className="border-b border-[#E8EDE8] bg-[#F4EED9]/40">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
          <Link
            href="/informasi/beasiswa"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#1F4B3B] transition hover:gap-3"
          >
            <FiArrowLeft />
            Kembali ke Daftar Beasiswa
          </Link>

          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1F4B3B]/10 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#1F4B3B] sm:text-xs">
              <FiBookOpen />
              Informasi Beasiswa
            </span>

            <h1 className="mt-5 break-words text-2xl font-extrabold leading-tight text-[#202820] sm:text-3xl md:text-4xl lg:text-5xl">
              {beasiswa.judul}
            </h1>

            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              Diselenggarakan oleh{" "}
              <span className="font-semibold text-[#1F4B3B]">
                {beasiswa.penyelenggara}
              </span>
            </p>

            <span
              className={`mt-5 inline-flex items-center rounded-full border px-4 py-2 text-xs font-bold ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-7 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 lg:px-10 lg:py-14">
        {/* Left Content */}
        <div className="min-w-0 space-y-6 sm:space-y-8">
          {/* Gambar */}
          {beasiswa.gambar && (
            <div className="overflow-hidden rounded-2xl border border-[#E8EDE8] bg-[#F4EED9]/30 sm:rounded-3xl">
              <img
                src={beasiswa.gambar}
                alt={beasiswa.judul}
                className="max-h-[500px] min-h-[180px] w-full object-contain sm:min-h-[260px]"
              />
            </div>
          )}

          {/* Deskripsi */}
          <DetailSection
            icon={<FiFileText className="text-xl" />}
            title="Deskripsi Beasiswa"
          >
            {beasiswa.deskripsi || "Belum ada deskripsi beasiswa."}
          </DetailSection>

          {/* Persyaratan */}
          <DetailSection
            icon={<FiCheckCircle className="text-xl" />}
            title="Persyaratan"
          >
            {beasiswa.persyaratan || "Belum ada informasi persyaratan."}
          </DetailSection>

          {/* Manfaat */}
          <DetailSection
            icon={<FiGift className="text-xl" />}
            title="Manfaat Beasiswa"
          >
            {beasiswa.manfaat || "Belum ada informasi manfaat beasiswa."}
          </DetailSection>
        </div>

        {/* Right Sidebar */}
        <aside className="min-w-0 lg:sticky lg:top-8">
          <div className="overflow-hidden rounded-2xl border border-[#E8EDE8] bg-white shadow-sm sm:rounded-3xl">
            <div className="bg-[#1F4B3B] px-5 py-5 text-white sm:px-6 sm:py-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Informasi Pendaftaran
              </p>
              <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                Periode Beasiswa
              </h2>
            </div>

            <div className="p-5 sm:p-6">
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                    <FiCalendar />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Tanggal Mulai</p>
                    <p className="mt-1 break-words text-sm font-semibold text-[#202820]">
                      {formatTanggal(beasiswa.tanggalMulai)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                    <FiCalendar />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Tanggal Berakhir</p>
                    <p className="mt-1 break-words text-sm font-semibold text-[#202820]">
                      {formatTanggal(beasiswa.tanggalSelesai)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-6 border-t border-dashed border-gray-200" />

              {beasiswa.status === "aktif" && beasiswa.linkPendaftaran ? (
                <a
                  href={beasiswa.linkPendaftaran}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1F4B3B] px-5 py-3.5 text-sm font-bold text-white transition duration-200 hover:bg-[#17392D] hover:shadow-lg"
                >
                  Daftar Beasiswa
                  <FiExternalLink />
                </a>
              ) : (
                <div className="rounded-2xl bg-gray-100 px-4 py-4 text-center text-sm font-semibold text-gray-500">
                  {beasiswa.status === "ditutup"
                    ? "Pendaftaran telah ditutup"
                    : beasiswa.status === "draft"
                      ? "Informasi belum dipublikasikan"
                      : "Link pendaftaran belum tersedia"}
                </div>
              )}

              <p className="mt-4 text-center text-xs leading-6 text-gray-400">
                Pastikan kamu membaca seluruh persyaratan sebelum melakukan
                pendaftaran.
              </p>
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
            Kembali ke Daftar Beasiswa
          </Link>
        </div>
      </section>
    </main>
  );
}
