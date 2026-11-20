
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";

export default function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Email diverifikasi melalui Firestore Rules.
      // Tidak perlu UID atau collection admins.
      await result.user.getIdToken(true);

      router.replace("/admin/dashboard");
    } catch (err: unknown) {
      const code =
        err instanceof Error && "code" in err
          ? String(err.code)
          : "";

      switch (code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          setError("Email atau password yang kamu masukkan salah.");
          break;

        case "auth/invalid-email":
          setError("Format email tidak valid.");
          break;

        case "auth/too-many-requests":
          setError("Terlalu banyak percobaan login. Coba kembali nanti.");
          break;

        case "auth/network-request-failed":
          setError("Koneksi internet bermasalah.");
          break;

        case "auth/user-disabled":
          setError("Akun ini telah dinonaktifkan.");
          break;

        default:
          setError("Login gagal. Silakan periksa kembali akun kamu.");
      }

      // Pastikan tidak ada sesi gagal yang tertinggal.
      if (auth.currentUser) {
        await signOut(auth);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">

      {/* EMAIL */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#1F4B3B]">
          Email Admin
        </label>

        <div className="flex items-center rounded-xl border border-gray-200 px-4 transition focus-within:border-[#1F4B3B] focus-within:ring-2 focus-within:ring-[#1F4B3B]/10">
          <FiMail size={18} className="text-gray-400" />

          <input
            type="email"
            placeholder="Masukkan email admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            className="h-13 w-full bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#1F4B3B]">
          Password
        </label>

        <div className="flex items-center rounded-xl border border-gray-200 px-4 transition focus-within:border-[#1F4B3B] focus-within:ring-2 focus-within:ring-[#1F4B3B]/10">
          <FiLock size={18} className="text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="h-13 w-full bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            className="text-gray-400 transition hover:text-[#1F4B3B]"
          >
            {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* LOGIN BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="group flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#1F4B3B] px-5 font-semibold text-white transition duration-300 hover:bg-[#17392D] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Memproses...
          </>
        ) : (
          <>
            Masuk Dashboard
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
