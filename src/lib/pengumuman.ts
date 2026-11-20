
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

export type StatusPengumuman = "draft" | "aktif" | "ditutup";

export interface Pengumuman {
  id?: string;
  kategori: "pengumuman";
  judul: string;
  isi: string;
  tanggalPublikasi: string;
  gambar?: string;
  linkTerkait?: string;
  status: StatusPengumuman;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type PengumumanInput = Omit<
  Pengumuman,
  "id" | "kategori" | "createdAt" | "updatedAt"
>;

const informasiRef = collection(db, "informasi");

export async function getPengumuman(): Promise<Pengumuman[]> {
  const q = query(
    informasiRef,
    where("kategori", "==", "pengumuman")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((item) => ({
      id: item.id,
      ...item.data(),
    }) as Pengumuman)
    .sort((a, b) =>
      b.tanggalPublikasi.localeCompare(a.tanggalPublikasi)
    );
}

export async function getPengumumanById(
  id: string
): Promise<Pengumuman | null> {
  const snapshot = await getDoc(doc(db, "informasi", id));

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  if (data.kategori !== "pengumuman") return null;

  return {
    id: snapshot.id,
    ...data,
  } as Pengumuman;
}

export async function createPengumuman(
  data: PengumumanInput
): Promise<string> {
  const result = await addDoc(informasiRef, {
    ...data,
    kategori: "pengumuman",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return result.id;
}

export async function updatePengumuman(
  id: string,
  data: Partial<PengumumanInput>
): Promise<void> {
  const docRef = doc(db, "informasi", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists() || snapshot.data().kategori !== "pengumuman") {
    throw new Error("Pengumuman tidak ditemukan.");
  }

  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePengumuman(id: string): Promise<void> {
  const docRef = doc(db, "informasi", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists() || snapshot.data().kategori !== "pengumuman") {
    throw new Error("Pengumuman tidak ditemukan.");
  }

  await deleteDoc(docRef);
}
