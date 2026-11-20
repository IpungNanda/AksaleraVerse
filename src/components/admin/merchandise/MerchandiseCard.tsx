
"use client";

import Image from "next/image";
import Link from "next/link";
import { FiPackage } from "react-icons/fi";

import type { Merchandise } from "@/lib/merchandise";
import WhatsAppOrderButton from "./WhatsAppOrderButton";

interface Props {
  product: Merchandise;
}

export default function MerchandiseCard({ product }: Props) {
  const rupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/merchandise/${product.id}`}>
        <div className="relative aspect-square bg-gray-100">
          {product.gambar?.[0] ? (
            <Image
              src={product.gambar[0]}
              alt={product.nama}
              fill
              unoptimized
              className="object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <FiPackage className="text-5xl" />
            </div>
          )}
        </div>

        <div className="p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-[#1F4B3B]">
            {product.kategori}
          </span>

          <h3 className="mt-2 line-clamp-2 font-bold text-gray-900">
            {product.nama}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {product.deskripsi}
          </p>

          <p className="mt-4 text-lg font-bold text-[#1F4B3B]">
            {rupiah(product.harga)}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Stok tersedia: {product.stok}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <WhatsAppOrderButton
          product={product}
          disabled={product.stok <= 0}
        />
      </div>
    </article>
  );
}
