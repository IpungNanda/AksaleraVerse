
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import {
  FiShield,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";

export const metadata = {
  title: "Login Admin | AksaleraVerse",
  description:
    "Halaman login administrator AksaleraVerse UNISRI.",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden bg-[#1F4B3B] lg:flex">

          {/* DECORATIVE ELEMENTS */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,238,217,0.10),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(244,238,217,0.08),transparent_35%)]" />

          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full border border-white/10" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* LOGO */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white p-1">
                  <img
                    src="/images/logo.png"
                    alt="Logo AksaleraVerse"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <p className="text-lg font-bold tracking-tight text-white">
                    AksaleraVerse
                  </p>

                  <p className="text-xs text-[#F4EED9]/70">
                    UNISRI Information Platform
                  </p>
                </div>
              </div>
            </div>

            {/* MAIN TEXT */}
            <div className="max-w-xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#F4EED9]/60">
                Administrator
              </p>

              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Kelola informasi,
                <br />
                Bangun koneksi.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
                Kelola informasi beasiswa, kesempatan magang,
                pengumuman, dan UNISRI Merchandise melalui
                satu dashboard yang sederhana dan terintegrasi.
              </p>
            </div>

            {/* FOOTER */}
            <div>
              <p className="text-sm text-white/40">
                © {new Date().getFullYear()} AksaleraVerse
              </p>
            </div>

          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">

          <div className="w-full max-w-md">

            {/* MOBILE LOGO */}
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4EED9] p-1">
                  <img
                    src="/images/logo.png"
                    alt="Logo AksaleraVerse"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                  <p className="font-bold text-[#1F4B3B]">
                    AksaleraVerse
                  </p>

                  <p className="text-xs text-gray-500">
                    Administrator
                  </p>
                </div>
              </div>
            </div>

            {/* HEADING */}
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold tracking-wider text-[#1F4B3B]">
                ADMINISTRATOR
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#1F4B3B]">
                Selamat datang kembali.
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Masuk untuk mengelola konten website
                AksaleraVerse.
              </p>
            </div>

            {/* FORM */}
            <AdminLoginForm />

            {/* BACK */}
            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#1F4B3B]"
              >
                <FiArrowLeft size={16} />
                Kembali ke website
              </Link>
            </div>

            {/* SECURITY INFO */}
            <div className="mt-10 border-t border-gray-100 pt-6">
              <div className="flex items-start gap-3">
                <FiShield
                  size={17}
                  className="mt-0.5 shrink-0 text-[#1F4B3B]"
                />

                <p className="text-xs leading-5 text-gray-400">
                  Halaman ini khusus administrator
                  AksaleraVerse. Pastikan kredensial
                  login tidak dibagikan kepada pihak lain.
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}
