
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

const ADMIN_EMAIL = "aksalera26@gmail.com";

// MENUNGGU FIREBASE MENYELESAIKAN PEMERIKSAAN SESI LOGIN
function waitForAuthUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    let unsubscribe = () => {};

    unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

// LOGIN ADMIN
export async function loginAdmin(
  email: string,
  password: string
): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail !== ADMIN_EMAIL) {
    throw new Error("Email tidak terdaftar sebagai admin.");
  }

  if (!password.trim()) {
    throw new Error("Password wajib diisi.");
  }

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      normalizedEmail,
      password
    );

    return result.user;
  } catch (error) {
    const firebaseError = error as { code?: string };

    if (
      firebaseError.code === "auth/invalid-credential" ||
      firebaseError.code === "auth/user-not-found" ||
      firebaseError.code === "auth/wrong-password"
    ) {
      throw new Error("Email atau password salah.");
    }

    if (firebaseError.code === "auth/too-many-requests") {
      throw new Error(
        "Terlalu banyak percobaan login. Coba beberapa saat lagi."
      );
    }

    throw new Error(
      error instanceof Error ? error.message : "Login gagal."
    );
  }
}

// LOGOUT ADMIN
export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

// MENGAMBIL AKUN ADMIN
export function getCurrentAdmin(): User | null {
  const user = auth.currentUser;

  if (user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    return null;
  }

  return user;
}

// CEK IZIN ADMIN
export async function checkAdminPermission(): Promise<void> {
  // Tunggu sampai Firebase selesai memulihkan sesi autentikasi
  const user = await waitForAuthUser();

  if (!user) {
    throw new Error("Anda belum login. Silakan login terlebih dahulu.");
  }

  if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
    throw new Error("Akses ditolak. Akun bukan admin.");
  }
}

// MEMANTAU STATUS LOGIN
export function subscribeAdminAuth(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, (user) => {
    if (user?.email?.toLowerCase() === ADMIN_EMAIL) {
      callback(user);
    } else {
      callback(null);
    }
  });
}
