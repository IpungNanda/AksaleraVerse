
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
// TIPE DATA MAGANG
// ============================================

export type MagangStatus = "draft" | "aktif" | "ditutup";

export interface Magang {
  id: string;
  judul: string;
  penyelenggara: string;
  posisi: string;
  lokasi: string;
  deskripsi: string;
  persyaratan: string;
  manfaat: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  gambar: string;
  linkPendaftaran: string;
  status: MagangStatus;
  kategori?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type MagangInput = Omit<
  Magang,
  "id" | "kategori" | "createdAt" | "updatedAt"
>;

// ============================================
// KONFIGURASI FIRESTORE
// ============================================

const COLLECTION_NAME = "informasi";
const CATEGORY_NAME = "magang";

// ============================================
// AMBIL SEMUA DATA MAGANG
// ============================================

export async function getMagang(): Promise<Magang[]> {
  try {
    const magangQuery = query(
      collection(db, COLLECTION_NAME),
      where("kategori", "==", CATEGORY_NAME)
    );

    const snapshot = await getDocs(magangQuery);

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as Magang[];

    // Urutkan data terbaru
    data.sort((a, b) => {
      const dateA =
        (a.createdAt as { seconds?: number })?.seconds ?? 0;

      const dateB =
        (b.createdAt as { seconds?: number })?.seconds ?? 0;

      return dateB - dateA;
    });

    return data;
  } catch (error) {
    console.error("Gagal mengambil data Magang:", error);
    throw error;
  }
}

// ============================================
// AMBIL DETAIL MAGANG BERDASARKAN ID
// ============================================

export async function getMagangById(
  id: string
): Promise<Magang | null> {
  try {
    if (!id) {
      throw new Error("ID Magang tidak ditemukan.");
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
    } as Magang;
  } catch (error) {
    console.error("Gagal mengambil detail Magang:", error);
    throw error;
  }
}

// ============================================
// TAMBAH DATA MAGANG
// ============================================

export async function createMagang(
  data: MagangInput
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

    console.log("Magang berhasil ditambahkan:", documentRef.id);

    return documentRef.id;
  } catch (error) {
    console.error("Gagal menambahkan Magang:", error);
    throw error;
  }
}

// ============================================
// EDIT DATA MAGANG
// ============================================

export async function updateMagang(
  id: string,
  data: Partial<MagangInput>
): Promise<void> {
  try {
    await checkAdminPermission();

    if (!id) {
      throw new Error("ID Magang tidak ditemukan.");
    }

    const documentRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      throw new Error("Data Magang tidak ditemukan.");
    }

    if (snapshot.data().kategori !== CATEGORY_NAME) {
      throw new Error("Dokumen ini bukan data Magang.");
    }

    await updateDoc(documentRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    console.log("Magang berhasil diperbarui:", id);
  } catch (error) {
    console.error("Gagal memperbarui Magang:", error);
    throw error;
  }
}

// ============================================
// HAPUS DATA MAGANG
// ============================================

export async function deleteMagang(id: string): Promise<void> {
  try {
    await checkAdminPermission();

    if (!id) {
      throw new Error("ID Magang tidak ditemukan.");
    }

    const documentRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(documentRef);

    if (!snapshot.exists()) {
      throw new Error("Data Magang tidak ditemukan.");
    }

    if (snapshot.data().kategori !== CATEGORY_NAME) {
      throw new Error("Dokumen ini bukan data Magang.");
    }

    await deleteDoc(documentRef);

    console.log("Magang berhasil dihapus:", id);
  } catch (error) {
    console.error("Gagal menghapus Magang:", error);
    throw error;
  }
}
