
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getMagang,
  deleteMagang,
  type Magang,
  type MagangStatus,
} from "@/lib/magang";

const statusStyle: Record<MagangStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  aktif: "bg-green-100 text-green-700",
  ditutup: "bg-red-100 text-red-600",
};

export default function MagangPage() {
  const [data, setData] = useState<Magang[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getMagang();
      setData(result);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data Magang."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        item.judul.toLowerCase().includes(keyword) ||
        item.penyelenggara.toLowerCase().includes(keyword) ||
        item.posisi.toLowerCase().includes(keyword) ||
        item.lokasi.toLowerCase().includes(keyword);

      const matchesStatus =
        filterStatus === "semua" || item.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, filterStatus]);

  const totalAktif = data.filter((item) => item.status === "aktif").length;
  const totalDraft = data.filter((item) => item.status === "draft").length;
  const totalDitutup = data.filter((item) => item.status === "ditutup").length;

  const handleDelete = async (item: Magang) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus program "${item.judul}"?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setError("");

    try {
      await deleteMagang(item.id);
      setData((current) =>
        current.filter((value) => value.id !== item.id)
      );
    } catch (err) {
      console.error("Hapus Magang:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus data Magang."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 space-y-6 pb-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">
            Manajemen Informasi
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#1F4B3B] sm:text-3xl">
            Informasi Magang
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola informasi program dan lowongan magang.
          </p>
        </div>

        <div className="flex flex-col gap-2 min-[420px]:flex-row">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <Link
            href="/admin/informasi/magang/tambah"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17392D]"
          >
            <FiPlus size={18} />
            Tambah Magang
          </Link>
        </div>
      </div>

      {/* STATISTIK */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E8EDE9] bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs text-gray-500 sm:text-sm">Total Magang</p>
          <p className="mt-2 text-2xl font-bold text-[#1F4B3B]">
            {data.length}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8EDE9] bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs text-gray-500 sm:text-sm">Aktif</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {totalAktif}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8EDE9] bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs text-gray-500 sm:text-sm">Draft</p>
          <p className="mt-2 text-2xl font-bold text-gray-600">
            {totalDraft}
          </p>
        </div>

        <div className="rounded-2xl border border-[#E8EDE9] bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs text-gray-500 sm:text-sm">Ditutup</p>
          <p className="mt-2 text-2xl font-bold text-red-500">
            {totalDitutup}
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#E8EDE9] bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama program, perusahaan, posisi..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#1F4B3B]"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1F4B3B] sm:w-48"
        >
          <option value="semua">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="draft">Draft</option>
          <option value="ditutup">Ditutup</option>
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <FiAlertCircle className="mt-0.5 shrink-0" />
          <p className="break-words">{error}</p>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="rounded-2xl border border-[#E8EDE9] bg-white p-12 text-center">
          <FiRefreshCw className="mx-auto animate-spin text-2xl text-[#1F4B3B]" />
          <p className="mt-3 text-sm text-gray-500">
            Memuat data Magang...
          </p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="rounded-2xl border border-[#E8EDE9] bg-white px-5 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F4B3B]/10 text-[#1F4B3B]">
            <FiBriefcase size={25} />
          </div>
          <h3 className="mt-4 font-bold text-[#1F4B3B]">
            {search || filterStatus !== "semua"
              ? "Data tidak ditemukan"
              : "Belum ada informasi Magang"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {search || filterStatus !== "semua"
              ? "Coba ubah kata kunci atau filter."
              : "Mulai tambahkan informasi program magang."}
          </p>
          {!search && filterStatus === "semua" && (
            <Link
              href="/admin/informasi/magang/tambah"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white"
            >
              <FiPlus />
              Tambah Magang
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* TABEL DESKTOP */}
          <div className="hidden overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#FAFBF9] text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Program Magang</th>
                    <th className="px-5 py-4">Penyelenggara</th>
                    <th className="px-5 py-4">Periode</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-[#FAFBF9]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.gambar}
                            alt={item.judul}
                            className="h-14 w-12 rounded-lg border border-gray-100 object-cover"
                          />
                          <div className="min-w-0">
                            <p className="max-w-64 truncate text-sm font-bold text-[#1F4B3B]">
                              {item.judul}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {item.posisi}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.penyelenggara}
                        <p className="mt-1 text-xs text-gray-400">
                          {item.lokasi}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500">
                        {formatDate(item.tanggalMulai)}
                        <span className="mx-1">–</span>
                        {formatDate(item.tanggalSelesai)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/admin/informasi/magang/detail/${item.id}`}
                            title="Detail"
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#1F4B3B]"
                          >
                            <FiEye size={17} />
                          </Link>

                          <Link
                            href={`/admin/informasi/magang/edit/${item.id}`}
                            title="Edit"
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <FiEdit2 size={17} />
                          </Link>

                          <button
                            type="button"
                            title="Hapus"
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <FiRefreshCw className="animate-spin" size={17} />
                            ) : (
                              <FiTrash2 size={17} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* KARTU MOBILE */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredData.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white shadow-sm"
              >
                <div className="flex gap-3 p-4">
                  <img
                    src={item.gambar}
                    alt={item.judul}
                    className="h-28 w-24 shrink-0 rounded-xl bg-gray-100 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${statusStyle[item.status]}`}
                    >
                      {item.status}
                    </span>

                    <h3 className="mt-2 line-clamp-2 text-sm font-bold text-[#1F4B3B]">
                      {item.judul}
                    </h3>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {item.penyelenggara}
                    </p>

                    <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                      <FiBriefcase />
                      {item.posisi}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
                  <p className="flex items-center gap-2">
                    <FiMapPin className="shrink-0" />
                    {item.lokasi}
                  </p>
                  <p className="flex items-center gap-2">
                    <FiCalendar className="shrink-0" />
                    {formatDate(item.tanggalMulai)} – {formatDate(item.tanggalSelesai)}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-[#FAFBF9] p-3">
                  <Link
                    href={`/admin/informasi/magang/detail/${item.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600"
                  >
                    <FiEye />
                    Detail
                  </Link>

                  <Link
                    href={`/admin/informasi/magang/edit/${item.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600"
                  >
                    <FiEdit2 />
                    Edit
                  </Link>

                  <button
                    type="button"
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                  >
                    <FiTrash2 />
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-gray-400">
        Menampilkan {filteredData.length} dari {data.length} data Magang.
      </p>
    </div>
  );
}
