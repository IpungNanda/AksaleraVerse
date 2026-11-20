
import BeasiswaForm from "@/components/admin/beasiswa/BeasiswaForm";

export const metadata = {
  title: "Tambah Beasiswa | AksaleraVerse",
};

export default function TambahBeasiswaPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div>
        <p className="text-xs text-gray-400">
          Informasi / Beasiswa / Tambah
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#1F4B3B]">
          Tambah Beasiswa
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Tambahkan informasi beasiswa baru ke AksaleraVerse.
        </p>
      </div>

      <BeasiswaForm mode="create" />

    </div>
  );
}
