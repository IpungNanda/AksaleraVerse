
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiBookOpen,
  FiCalendar,
} from "react-icons/fi";

import {
  getBeasiswa,
  deleteBeasiswa,
  type Beasiswa,
} from "@/lib/beasiswa";

export default function BeasiswaPage() {
  const [data, setData] = useState<Beasiswa[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getBeasiswa();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data beasiswa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.judul.toLowerCase().includes(search.toLowerCase()) ||
        item.penyelenggara.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        filterStatus === "semua" || item.status === filterStatus;

      return matchSearch && matchStatus;
    });
  }, [data, search, filterStatus]);

  const handleDelete = async (item: Beasiswa) => {
    const confirmed = window.confirm(
      `Hapus beasiswa "${item.judul}"? Data Firestore akan dihapus.`
    );

    if (!confirmed) return;

    try {
      await deleteBeasiswa(item.id);
      setData((previous) =>
        previous.filter((data) => data.id !== item.id)
      );
    } catch (err) {
      console.error(err);
      window.alert("Gagal menghapus beasiswa.");
    }
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "aktif":
        return "bg-green-50 text-green-700";
      case "ditutup":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Informasi</span>
            <span>/</span>
            <span className="text-[#1F4B3B]">Beasiswa</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#1F4B3B]">
            Informasi Beasiswa
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Kelola informasi dan kesempatan beasiswa mahasiswa.
          </p>
        </div>

        <Link
          href="/admin/informasi/beasiswa/tambah"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17392D]"
        >
          <FiPlus size={18} />
          Tambah Beasiswa
        </Link>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Beasiswa", value: data.length },
          {
            label: "Aktif",
            value: data.filter((item) => item.status === "aktif").length,
          },
          {
            label: "Draft",
            value: data.filter((item) => item.status === "draft").length,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#E8EDE9] bg-white p-5"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <h3 className="mt-2 text-3xl font-bold text-[#1F4B3B]">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* TABLE CONTAINER */}
      <section className="overflow-hidden rounded-2xl border border-[#E8EDE9] bg-white">

        {/* FILTER */}
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full md:max-w-sm">
            <FiSearch
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari beasiswa atau penyelenggara..."
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#1F4B3B]"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-[#1F4B3B]"
            >
              <option value="semua">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="draft">Draft</option>
              <option value="ditutup">Ditutup</option>
            </select>

            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              title="Muat ulang"
              className="rounded-xl border border-gray-200 px-4 text-[#1F4B3B] transition hover:bg-[#F4EED9] disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <FiRefreshCw className="animate-spin text-[#1F4B3B]" size={28} />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4EED9] text-[#1F4B3B]">
              <FiBookOpen size={25} />
            </div>

            <h3 className="mt-4 font-bold text-[#1F4B3B]">
              {data.length === 0
                ? "Belum ada data beasiswa"
                : "Beasiswa tidak ditemukan"}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-400">
              {data.length === 0
                ? "Mulai tambahkan informasi beasiswa pertama kamu."
                : "Coba gunakan kata kunci atau filter yang berbeda."}
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-[#FAFBF9] text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Beasiswa</th>
                    <th className="px-5 py-4">Penyelenggara</th>
                    <th className="px-5 py-4">Periode</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="transition hover:bg-[#FAFBF9]">

                      <td className="px-5 py-4">
                        <div className="flex min-w-[230px] items-center gap-3">
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#F4EED9]">
                            {item.gambar && (
                              <img
                                src={item.gambar}
                                alt={item.judul}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>

                          <div>
                            <p className="max-w-[220px] text-sm font-semibold text-[#1F4B3B]">
                              {item.judul}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {item.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {item.penyelenggara}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiCalendar />
                          {item.tanggalMulai || "-"}
                        </div>
                        <p className="mt-1 pl-5">
                          s.d. {item.tanggalSelesai || "-"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/informasi/beasiswa/detail/${item.id}`}
                            title="Detail"
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-[#F4EED9] hover:text-[#1F4B3B]"
                          >
                            <FiEye size={16} />
                          </Link>

                          <Link
                            href={`/admin/informasi/beasiswa/edit/${item.id}`}
                            title="Edit"
                            className="rounded-lg border border-gray-200 p-2 text-blue-600 transition hover:bg-blue-50"
                          >
                            <FiEdit2 size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            title="Hapus"
                            className="rounded-lg border border-gray-200 p-2 text-red-500 transition hover:bg-red-50"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-3 p-4 md:hidden">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <div className="flex gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#F4EED9]">
                      {item.gambar && (
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[#1F4B3B]">
                        {item.judul}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.penyelenggara}
                      </p>

                      <span className={`mt-2 inline-block rounded-full px-3 py-1 text-[10px] font-semibold capitalize ${statusStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                    <Link
                      href={`/admin/informasi/beasiswa/detail/${item.id}`}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600"
                    >
                      <FiEye size={16} />
                    </Link>

                    <Link
                      href={`/admin/informasi/beasiswa/edit/${item.id}`}
                      className="rounded-lg border border-gray-200 p-2 text-blue-600"
                    >
                      <FiEdit2 size={16} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded-lg border border-gray-200 p-2 text-red-500"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && filteredData.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 text-xs text-gray-400">
            Menampilkan {filteredData.length} dari {data.length} beasiswa
          </div>
        )}
      </section>
    </div>
  );
}
