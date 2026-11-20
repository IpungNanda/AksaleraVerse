
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiPlus,
  FiSearch,
  FiEye,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";

import { checkAdminPermission } from "@/lib/auth";
import {
  deletePengumuman,
  getPengumuman,
  type Pengumuman,
} from "@/lib/pengumuman";

export default function PengumumanPage() {
  const [data, setData] = useState<Pengumuman[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await checkAdminPermission();
      const result = await getPengumuman();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengambil data."
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
      const matchSearch = item.judul
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        filter === "semua" || item.status === filter;

      return matchSearch && matchStatus;
    });
  }, [data, search, filter]);

  const handleDelete = async (item: Pengumuman) => {
    if (!item.id) return;

    const confirmed = window.confirm(
      `Yakin ingin menghapus pengumuman "${item.judul}"?`
    );

    if (!confirmed) return;

    try {
      await checkAdminPermission();
      await deletePengumuman(item.id);
      setData((previous) =>
        previous.filter((row) => row.id !== item.id)
      );
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Gagal menghapus data."
      );
    }
  };

  const statusStyle = (status: string) => {
    if (status === "aktif") return "bg-green-100 text-green-700";
    if (status === "ditutup") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1F4B3B]">
            Pengumuman
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola informasi dan pengumuman AksaleraVerse.
          </p>
        </div>

        <Link
          href="/admin/informasi/pengumuman/tambah"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#17392D]"
        >
          <FiPlus /> Tambah Pengumuman
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total", value: data.length },
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
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#1F4B3B]">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul pengumuman..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#1F4B3B]"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1F4B3B]"
        >
          <option value="semua">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="aktif">Aktif</option>
          <option value="ditutup">Ditutup</option>
        </select>

        <button
          onClick={loadData}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center text-sm text-gray-500">
          Memuat data pengumuman...
        </div>
      ) : filteredData.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="font-semibold text-gray-700">
            Belum ada pengumuman.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Tambahkan pengumuman pertama melalui tombol di atas.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-[#F4EED9]/70 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Judul</th>
                  <th className="px-5 py-4">Tanggal Publikasi</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="max-w-sm px-5 py-4 font-semibold text-gray-800">
                      {item.judul}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {item.tanggalPublikasi}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/informasi/pengumuman/detail/${item.id}`}
                          title="Detail"
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        >
                          <FiEye />
                        </Link>
                        <Link
                          href={`/admin/informasi/pengumuman/edit/${item.id}`}
                          title="Edit"
                          className="rounded-lg bg-yellow-50 p-2 text-yellow-700 hover:bg-yellow-100"
                        >
                          <FiEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(item)}
                          title="Hapus"
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
