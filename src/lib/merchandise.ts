import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type StatusMerchandise = "aktif" | "nonaktif";

export interface Merchandise {
  id?: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  detail: string;
  harga: number;
  stok: number;
  gambar: string[];
  whatsapp: string;
  status: StatusMerchandise;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type MerchandiseInput = Omit<
  Merchandise,
  "id" | "createdAt" | "updatedAt"
>;

const merchandiseRef = collection(db, "merchandise");

export async function getMerchandise(): Promise<Merchandise[]> {
  const snapshot = await getDocs(merchandiseRef);

  return snapshot.docs
    .map((item) => ({
      id: item.id,
      ...item.data(),
    }) as Merchandise)
    .sort((a, b) => a.nama.localeCompare(b.nama));
}

export async function getMerchandiseAktif(): Promise<Merchandise[]> {
  const products = await getMerchandise();
  return products.filter((item) => item.status === "aktif");
}

export async function getMerchandiseById(
  id: string
): Promise<Merchandise | null> {
  const snapshot = await getDoc(doc(db, "merchandise", id));
  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Merchandise;
}

export async function createMerchandise(
  data: MerchandiseInput
): Promise<string> {
  const result = await addDoc(merchandiseRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return result.id;
}

export async function updateMerchandise(
  id: string,
  data: Partial<MerchandiseInput>
): Promise<void> {
  const docRef = doc(db, "merchandise", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("Produk merchandise tidak ditemukan.");
  }

  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteMerchandise(id: string): Promise<void> {
  const docRef = doc(db, "merchandise", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error("Produk merchandise tidak ditemukan.");
  }

  await deleteDoc(docRef);
}
