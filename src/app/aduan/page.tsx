
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiFileText,
  FiHeart,
  FiLock,
  FiMail,
  FiMessageCircle,
  FiPhone,
  FiSend,
  FiShield,
  FiUser,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";

type AduanForm = {
  nama: string;
  npm: string;
  programStudi: string;
  email: string;
  whatsapp: string;
  kategori: string;
  subjek: string;
  pesan: string;
};

const initialForm: AduanForm = {
  nama: "",
  npm: "",
  programStudi: "",
  email: "",
  whatsapp: "",
  kategori: "",
  subjek: "",
  pesan: "",
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const categories = [
  "Akademik",
  "Fasilitas Kampus",
  "Organisasi Kemahasiswaan",
  "Pelayanan Mahasiswa",
  "Administrasi",
  "Lainnya",
];

export default function AduanPage() {
  const [form, setForm] = useState<AduanForm>(initialForm);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!consent) {
      setError(
        "Silakan setujui pernyataan privasi sebelum mengirimkan aduan."
      );
      return;
    }

    if (!form.nama.trim() || !form.npm.trim()) {
      setError("Nama dan NPM wajib diisi.");
      return;
    }

    if (!form.programStudi || !form.kategori) {
      setError("Program studi dan kategori aduan wajib dipilih.");
      return;
    }

    if (!form.email.trim() || !form.whatsapp.trim()) {
      setError("Email dan nomor WhatsApp wajib diisi.");
      return;
    }

    if (!form.subjek.trim() || !form.pesan.trim()) {
      setError("Subjek dan isi aduan wajib diisi.");
      return;
    }

    if (form.pesan.trim().length < 20) {
      setError("Isi aduan minimal 20 karakter agar mudah dipahami.");
      return;
    }

    // Nomor tujuan WhatsApp BEM KM UNISRI (format internasional tanpa +).
    const nomorTujuan = "6289513132498";

    const pesanWhatsApp = [
      "📢 *ADUAN MAHASISWA — AKSALERAVERSE*",
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      "👤 *IDENTITAS PELAPOR*",
      `Nama: ${form.nama.trim()}`,
      `NPM: ${form.npm.trim()}`,
      `Program Studi: ${form.programStudi.trim()}`,
      "",
      "📞 *INFORMASI KONTAK*",
      `Email: ${form.email.trim()}`,
      `WhatsApp: ${form.whatsapp.trim()}`,
      "",
      "📝 *DETAIL ADUAN*",
      `Kategori: ${form.kategori}`,
      `Subjek: ${form.subjek.trim()}`,
      "",
      "*Isi Aduan:*",
      form.pesan.trim(),
      "",
      "━━━━━━━━━━━━━━━━━━━━",
      "_Dikirim melalui formulir Aduan AksaleraVerse._",
    ].join("\n");

    const urlWhatsApp = `https://wa.me/${nomorTujuan}?text=${encodeURIComponent(
      pesanWhatsApp
    )}`;

    // Membuka WhatsApp dengan pesan yang sudah disiapkan.
    // Pelapor tetap perlu menekan tombol Kirim di aplikasi WhatsApp.
    const jendelaWhatsApp = window.open(
      urlWhatsApp,
      "_blank",
      "noopener,noreferrer"
    );

    // Jika browser memblokir tab baru, arahkan tab saat ini ke WhatsApp.
    if (!jendelaWhatsApp) {
      window.location.assign(urlWhatsApp);
      return;
    }

    setSuccess(true);
    setForm(initialForm);
    setConsent(false);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#202820]">
      {/* =========================================
          HERO SECTION
      ========================================== */}

      <section className="bg-white">
        <div className="mx-auto grid min-h-[540px] max-w-7xl items-center gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 lg:px-10 lg:py-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#1F4B3B]/15 bg-white px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#1F4B3B]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1F4B3B] sm:text-xs">
                Student Voice & Aspiration
              </span>
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-[#1F4B3B] sm:text-5xl lg:text-[62px]">
              Suaramu
              <br />
              Berarti
              <span className="relative ml-2 inline-block">
                bagi Kami.
                <span className="absolute -bottom-1 left-0 -z-0 h-3 w-full rounded-full bg-[#D6C99D]/70" />
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-gray-600 sm:text-base">
              AksaleraVerse menyediakan ruang bagi mahasiswa untuk
              menyampaikan aspirasi, kritik, maupun pengaduan.
              Setiap masukan menjadi bagian penting dalam membangun
              lingkungan kampus yang lebih baik.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#form-aduan"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-[#1F4B3B] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-[#1F4B3B]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#173B2E]"
              >
                Sampaikan Aduan
                <FiArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1F4B3B]/20 bg-white px-7 py-4 text-sm font-bold text-[#1F4B3B] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F4EED9]"
              >
                Kembali ke Beranda
                <FiArrowUpRight size={17} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <FiShield className="text-[#1F4B3B]" size={16} />
                Privasi diperhatikan
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <FiMessageCircle className="text-[#1F4B3B]" size={16} />
                Ruang aspirasi mahasiswa
              </div>
            </div>
          </motion.div>

          {/* HERO MASCOT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 25 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative mx-auto flex w-full max-w-[530px] items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full"
            >
              <img
                src="/images/aduan.png"
                alt="Maskot AksaleraVerse"
                className="mx-auto h-auto max-h-[280px] w-full object-contain drop-shadow-2xl sm:max-h-[330px] lg:max-h-[380px]"
              />
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute right-2 top-12 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white text-[#B38735] shadow-lg sm:right-5"
            >
              <FiHeart size={25} />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute bottom-16 left-2 z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1F4B3B] text-white shadow-lg sm:left-5"
            >
              <FiMessageCircle size={24} />
            </motion.div>
          </motion.div>
        </div>

        <div className="h-px w-full bg-gray-100" />
      </section>

      {/* =========================================
          INTRODUCTION
      ========================================== */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-10 lg:grid-cols-2 lg:items-center"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B784A]">
              Ruang Aspirasi
            </span>

            <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight text-[#1F4B3B] sm:text-4xl">
              Setiap Suara Memiliki Arti dan Peran
            </h2>

            <div className="mt-5 h-1.5 w-20 rounded-full bg-[#D6C99D]" />
          </div>

          <div className="space-y-5 text-sm leading-8 text-gray-600 sm:text-base">
            <p>
              Melalui layanan aduan AksaleraVerse, mahasiswa dapat
              menyampaikan permasalahan, kritik, dan saran yang
              berkaitan dengan lingkungan kampus maupun pelayanan
              kemahasiswaan.
            </p>

            <p>
              Informasi yang kamu sampaikan akan diteruskan kepada
              pihak pengelola untuk ditinjau dan ditindaklanjuti
              sesuai kebutuhan.
            </p>

            <p className="font-semibold text-[#1F4B3B]">
              Sampaikan dengan jelas, santun, dan bertanggung jawab.
            </p>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          KEUNGGULAN LAYANAN
      ========================================== */}

      <section className="border-y border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10 max-w-2xl"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B784A]">
              Layanan Aduan
            </span>

            <h2 className="mt-4 text-3xl font-extrabold text-[#1F4B3B] sm:text-4xl">
              Ruang Aman untuk Menyampaikan Aspirasi
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              Kami menyediakan ruang penyampaian aspirasi dengan
              memperhatikan informasi dan kebutuhan mahasiswa.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                icon: FiLock,
                title: "Privasi Data",
                description:
                  "Informasi pribadi tidak ditampilkan secara publik dan digunakan untuk keperluan penanganan aduan.",
                number: "01",
              },
              {
                icon: FiMessageCircle,
                title: "Penyampaian Mudah",
                description:
                  "Sampaikan kritik, saran, maupun pengaduan melalui formulir yang telah disediakan.",
                number: "02",
              },
              {
                icon: FiHeart,
                title: "Aspirasi Mahasiswa",
                description:
                  "Setiap masukan menjadi bahan evaluasi untuk mendukung lingkungan kampus yang lebih baik.",
                number: "03",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="group flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#1F4B3B]/20 hover:shadow-xl hover:shadow-[#1F4B3B]/5 sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4EED9] text-[#1F4B3B]">
                      <Icon size={25} />
                    </div>

                    <span className="text-xs font-bold tracking-widest text-gray-300">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-[#1F4B3B]">
                    {item.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-gray-500">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================
          FORM ADUAN
      ========================================== */}

      <section
        id="form-aduan"
        className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 lg:px-10 lg:py-20"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-2xl"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B784A]">
            Formulir Pengaduan
          </span>

          <h2 className="mt-4 text-3xl font-extrabold text-[#1F4B3B] sm:text-4xl">
            Sampaikan Aduanmu
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
            Lengkapi informasi berikut agar aduan dapat dipahami dan
            ditindaklanjuti dengan lebih baik.
          </p>
        </motion.div>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          {/* FORM */}
          <motion.form
            onSubmit={handleSubmit}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8 lg:p-9"
          >
            <div className="mb-8 flex items-center gap-3 border-b border-gray-100 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                <FiFileText size={23} />
              </div>

              <div>
                <h3 className="font-bold text-[#1F4B3B]">
                  Formulir Aduan Mahasiswa
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Kolom bertanda * wajib diisi
                </p>
              </div>
            </div>

            {/* IDENTITAS */}
            <div className="mb-8">
              <h4 className="mb-5 flex items-center gap-2 text-sm font-bold text-[#1F4B3B]">
                <FiUser size={17} />
                Identitas Pelapor
              </h4>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="nama"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Nama Lengkap *
                  </label>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    required
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="npm"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    NPM *
                  </label>
                  <input
                    id="npm"
                    name="npm"
                    type="text"
                    required
                    value={form.npm}
                    onChange={handleChange}
                    placeholder="Masukkan NPM"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/5"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="programStudi"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Program Studi *
                  </label>
                  <div className="relative">
                    <input
                      id="programStudi"
                      name="programStudi"
                      type="text"
                      required
                      value={form.programStudi}
                      onChange={handleChange}
                      placeholder="Tuliskan program studi kamu"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* KONTAK */}
            <div className="mb-8 border-t border-gray-100 pt-8">
              <h4 className="mb-5 flex items-center gap-2 text-sm font-bold text-[#1F4B3B]">
                <FiMail size={17} />
                Informasi Kontak
              </h4>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Aktif *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/5"
                  />
                </div>

                <div>
                  <label
                    htmlFor="whatsapp"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Nomor WhatsApp *
                  </label>
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="Contoh: 628123456789"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/5"
                  />
                </div>
              </div>

              <p className="mt-3 text-xs leading-6 text-gray-400">
                Email dan nomor WhatsApp digunakan sebagai informasi
                kontak apabila diperlukan tindak lanjut.
              </p>
            </div>

            {/* DETAIL ADUAN */}
            <div className="mb-8 border-t border-gray-100 pt-8">
              <h4 className="mb-5 flex items-center gap-2 text-sm font-bold text-[#1F4B3B]">
                <FiMessageCircle size={17} />
                Detail Aduan
              </h4>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="kategori"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Kategori Aduan *
                  </label>

                  <div className="relative">
                    <select
                      id="kategori"
                      name="kategori"
                      required
                      value={form.kategori}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-700 outline-none transition focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/5"
                    >
                      <option value="">Pilih kategori aduan</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>

                    <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subjek"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Subjek Aduan *
                  </label>
                  <input
                    id="subjek"
                    name="subjek"
                    type="text"
                    required
                    value={form.subjek}
                    onChange={handleChange}
                    placeholder="Tuliskan inti permasalahan"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/5"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label
                      htmlFor="pesan"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Isi Aduan *
                    </label>
                    <span className="text-xs text-gray-400">
                      {form.pesan.length}/5000
                    </span>
                  </div>

                  <textarea
                    id="pesan"
                    name="pesan"
                    required
                    rows={7}
                    maxLength={5000}
                    value={form.pesan}
                    onChange={handleChange}
                    placeholder="Jelaskan permasalahan, kritik, atau saran yang ingin kamu sampaikan secara jelas dan terperinci..."
                    className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm leading-7 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#1F4B3B] focus:ring-4 focus:ring-[#1F4B3B]/5"
                  />

                  <p className="mt-2 text-xs leading-6 text-gray-400">
                    Minimal 20 karakter. Hindari penggunaan kata-kata
                    yang tidak pantas dan sertakan informasi yang relevan.
                  </p>
                </div>
              </div>
            </div>

            {/* PRIVACY CONSENT */}
            <div className="border-t border-gray-100 pt-7">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (error) setError("");
                  }}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#1F4B3B]"
                />

                <span className="text-xs leading-6 text-gray-500 sm:text-sm">
                  Saya menyatakan bahwa informasi yang disampaikan
                  benar dan dapat dipertanggungjawabkan. Saya memahami
                  bahwa data pribadi digunakan untuk keperluan
                  penanganan aduan. *
                </span>
              </label>
            </div>

            {/* ERROR MESSAGE */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
                >
                  <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
                  <p className="leading-6">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SUBMIT */}
            <button
              type="submit"
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#1F4B3B] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#1F4B3B]/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#173B2E]"
            >
              Lanjutkan ke WhatsApp
              <FiSend size={17} />
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-gray-400">
              Pastikan seluruh informasi telah diperiksa sebelum
              mengirimkan aduan.
            </p>
          </motion.form>

          {/* SIDEBAR */}
          <div className="space-y-5 lg:sticky lg:top-28">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-[#1F4B3B] p-6 text-white sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-[#D6B36A]">
                <FiShield size={24} />
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Privasi dan Kerahasiaan
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/70">
                Data identitas dan kontak yang kamu berikan tidak
                ditampilkan secara publik. Informasi tersebut
                digunakan untuk keperluan komunikasi dan penanganan
                aduan oleh pihak yang berwenang.
              </p>

              <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                <div className="flex items-start gap-3">
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-[#D6B36A]"
                    size={18}
                  />
                  <p className="text-xs leading-6 text-white/75">
                    Identitas tidak ditampilkan pada halaman publik.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-[#D6B36A]"
                    size={18}
                  />
                  <p className="text-xs leading-6 text-white/75">
                    Informasi digunakan untuk penanganan aduan.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-[#D6B36A]"
                    size={18}
                  />
                  <p className="text-xs leading-6 text-white/75">
                    Akses data dibatasi kepada pihak yang berwenang.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                <FiClock size={23} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#1F4B3B]">
                Bagaimana Aduan Diproses?
              </h3>

              <div className="mt-5 space-y-5">
                {[
                  {
                    number: "01",
                    title: "Aduan Dikirim",
                    description:
                      "Kamu mengisi dan mengirimkan formulir aduan.",
                  },
                  {
                    number: "02",
                    title: "Aduan Ditinjau",
                    description:
                      "Informasi diterima untuk diperiksa oleh pengelola.",
                  },
                  {
                    number: "03",
                    title: "Tindak Lanjut",
                    description:
                      "Aduan ditindaklanjuti sesuai kebutuhan dan kewenangan.",
                  },
                ].map((item, index) => (
                  <div key={item.number} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4EED9] text-xs font-extrabold text-[#1F4B3B]">
                        {item.number}
                      </span>
                      {index !== 2 && (
                        <span className="mt-2 h-7 w-px bg-gray-200" />
                      )}
                    </div>

                    <div className="pb-2">
                      <h4 className="text-sm font-bold text-[#1F4B3B]">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs leading-6 text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl border border-gray-100 bg-white p-6"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F4EED9] text-[#1F4B3B]">
                  <FiMail size={21} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#1F4B3B]">
                    Butuh Informasi?
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Hubungi pengelola AksaleraVerse
                  </p>
                </div>
              </div>

              <a
                href="mailto:pp.aksalera2026@gmail.com"
                className="mt-5 flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-xs font-semibold text-[#1F4B3B] transition hover:border-[#1F4B3B]/30 hover:bg-[#F4EED9]/50"
              >
                pp.aksalera2026@gmail.com
                <FiArrowUpRight size={16} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================
          FINAL CTA
      ========================================== */}

      <section className="border-t border-gray-100 bg-white px-5 pb-20 pt-8 sm:px-8 lg:px-10 lg:pb-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#1F4B3B] px-6 py-10 sm:px-12 sm:py-14"
        >
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D6B36A]">
                AKSALERAVERSE
              </p>

              <h2 className="mt-3 text-2xl font-bold leading-snug text-white sm:text-3xl">
                Bersama Membangun
                <br className="hidden sm:block" />
                Lingkungan Kampus yang Lebih Baik.
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/70">
                Kritik, saran, dan aspirasi darimu merupakan bagian
                penting dari perubahan.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex w-fit shrink-0 items-center gap-3 rounded-xl bg-[#F4EED9] px-6 py-3.5 text-sm font-bold text-[#1F4B3B] transition hover:-translate-y-1 hover:bg-white"
            >
              Kembali ke Beranda
              <FiArrowRight size={17} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* =========================================
          SUCCESS MODAL
      ========================================== */}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#14251D]/60 px-5 py-8 backdrop-blur-sm"
            onClick={() => setSuccess(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9"
            >
              <button
                type="button"
                onClick={() => setSuccess(false)}
                aria-label="Tutup popup"
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <FiX size={19} />
              </button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.15,
                  type: "spring",
                  stiffness: 200,
                }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF4ED] text-[#1F4B3B]"
              >
                <FiCheck size={38} strokeWidth={3} />
              </motion.div>

              <span className="mt-7 inline-flex rounded-full bg-[#F4EED9] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B784A]">
                Siap Dikirim melalui WhatsApp
              </span>

              <h3 className="mt-4 text-2xl font-extrabold text-[#1F4B3B]">
                WhatsApp Berhasil Dibuka!
              </h3>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                Pesan aduan sudah disiapkan di WhatsApp tujuan.
                Periksa kembali isi pesan, lalu tekan tombol Kirim
                di WhatsApp agar aduan diterima oleh pengelola.
              </p>

              <div className="mt-7 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left">
                <div className="flex items-start gap-3">
                  <FiCheckCircle
                    className="mt-0.5 shrink-0 text-[#1F4B3B]"
                    size={18}
                  />
                  <p className="text-xs leading-6 text-gray-500">
                    Aduan belum terkirim sampai kamu menekan tombol
                    Kirim di WhatsApp. Pastikan pesan sudah terkirim
                    sebelum menutup percakapan.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F4B3B] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#173B2E]"
              >
                Mengerti
                <FiArrowRight size={17} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
