
"use client";

import { FiMessageCircle } from "react-icons/fi";
import type { Merchandise } from "@/lib/merchandise";

interface Props {
  product: Merchandise;
  disabled?: boolean;
}

export default function WhatsAppOrderButton({
  product,
  disabled = false,
}: Props) {
  const handleOrder = () => {
    const phone = product.whatsapp.replace(/\D/g, "");

    if (!/^62\d{8,13}$/.test(phone)) {
      alert("Nomor WhatsApp produk belum valid.");
      return;
    }

    const price = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(product.harga);

    const productUrl =
      `${window.location.origin}/merchandise/${product.id}`;

    const message = [
      "Halo, saya tertarik untuk memesan merchandise UNISRI.",
      "",
      `Nama produk: ${product.nama}`,
      `Kategori: ${product.kategori}`,
      `Harga: ${price}`,
      "",
      `Link produk: ${productUrl}`,
      "",
      "Apakah produk ini masih tersedia?",
      "Saya ingin mendapatkan informasi pemesanan lebih lanjut.",
      "",
      "Terima kasih.",
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleOrder}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#17392D] disabled:cursor-not-allowed disabled:bg-gray-300"
    >
      <FiMessageCircle className="text-lg" />
      {disabled ? "Stok Habis" : "Pesan via WhatsApp"}
    </button>
  );
}
