
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { checkAdminPermission } from "@/lib/auth";

// ============================================
// TIPE DATA BEASISWA
// ============================================

export type BeasiswaStatus = "draft" | "aktif" | "ditutup";

export interface Beasiswa {
  id: string;
  judul: string;
  penyelenggara: string;
  deskripsi: string;
  persyaratan: string;
  manfaat: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  gambar: string;
  linkPendaftaran: string;
  status: BeasiswaStatus;
  kategori?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type BeasiswaInput = Omit<
  Beasiswa,
  "id" | "kategori" | "createdAt" | "updatedAt"
>;

// ============================================
// KONFIGURASI KOLEKSI
// ============================================

const COLLECTION_NAME = "informasi";
const CATEGORY_NAME = "beasiswa";

// ============================================
// AMBIL SEMUA DATA BEASISWA
// ============================================

export async function getBeasiswa(): Promise<Beasiswa[]> {
  try {
    const beasiswaQuery = query(
      collection(db, COLLECTION_NAME),
      where("kategori", "==", CATEGORY_NAME)
    );

    const snapshot = await getDocs(beasiswaQuery);

    const data: Beasiswa[] = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Beasiswa[];

    // Urutkan data terbaru terlebih dahulu
    data.sort((a, b) => {
      const dateA = (a.createdAt as { seconds?: number })?.seconds ?? 0;
      const dateB = (b.createdAt as { seconds?: number })?.seconds ?? 0;

      return dateB - dateA;
    });

    return data;
  } catch (error) {
    console.error("Gagal mengambil data Beasiswa:", error);
    throw error;
  }
}

// ============================================
// AMBIL DETAIL BEASISWA BERDASARKAN ID
// ============================================

export async function getBeasiswaById(
  id: string
): Promise<Beasiswa | null> {
  try {
    if (!id) {
      throw new Error("ID Beasiswa tidak ditemukan.");
    }

    const documentRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      return null;
    }

    const data = snapshot.data();

    if (data.kategori !== CATEGORY_NAME) {
      return null;
    }

    return {
      id: snapshot.id,
      ...data,
    } as Beasiswa;
  } catch (error) {
    console.error("Gagal mengambil detail Beasiswa:", error);
    throw error;
  }
}

// ============================================
// TAMBAH BEASISWA
// ============================================

export async function createBeasiswa(
  data: BeasiswaInput
): Promise<string> {
  try {
    await checkAdminPermission();

    const documentRef = await addDoc(
      collection(db, COLLECTION_NAME),
      {
        ...data,
        kategori: CATEGORY_NAME,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
    );

    console.log(
      "Beasiswa berhasil ditambahkan:",
      documentRef.id
    );

    return documentRef.id;
  } catch (error) {
    console.error("Gagal menambahkan Beasiswa:", error);
    throw error;
  }
}

// ============================================
// EDIT BEASISWA
// ============================================

export async function updateBeasiswa(
  id: string,
  data: Partial<BeasiswaInput>
): Promise<void> {
  try {
    await checkAdminPermission();

    if (!id) {
      throw new Error("ID Beasiswa tidak ditemukan.");
    }

    const documentRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      throw new Error("Data Beasiswa tidak ditemukan.");
    }

    if (snapshot.data().kategori !== CATEGORY_NAME) {
      throw new Error("Dokumen ini bukan data Beasiswa.");
    }

    await updateDoc(documentRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    console.log("Beasiswa berhasil diperbarui:", id);
  } catch (error) {
    console.error("Gagal memperbarui Beasiswa:", error);
    throw error;
  }
}

// ============================================
// HAPUS BEASISWA
// ============================================

export async function deleteBeasiswa(
  id: string
): Promise<void> {
  try {
    await checkAdminPermission();

    if (!id) {
      throw new Error("ID Beasiswa tidak ditemukan.");
    }

    const documentRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      throw new Error("Data Beasiswa tidak ditemukan.");
    }

    if (snapshot.data().kategori !== CATEGORY_NAME) {
      throw new Error("Dokumen ini bukan data Beasiswa.");
    }

    await deleteDoc(documentRef);

    console.log("Beasiswa berhasil dihapus:", id);
  } catch (error) {
    console.error("Gagal menghapus Beasiswa:", error);
    throw error;
  }
}
