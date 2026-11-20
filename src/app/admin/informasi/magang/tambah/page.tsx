
import type { Metadata } from "next";
import MagangForm from "@/components/admin/magang/MagangForm";

export const metadata: Metadata = {
  title: "Tambah Magang | AksaleraVerse",
  description: "Tambah informasi program magang AksaleraVerse.",
};

export default function TambahMagangPage() {
  return (
    <MagangForm mode="create" />
  );
}
