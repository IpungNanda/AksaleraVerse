
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import PublicLayout from "@/components/layout/PublicLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AksaleraVerse | BEM KM UNISRI",
    template: "%s | AksaleraVerse",
  },
  description:
    "AksaleraVerse merupakan platform informasi mahasiswa UNISRI yang menyediakan informasi beasiswa, magang, pengumuman, merchandise, dan layanan aduan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-white font-sans text-[#202820]">
        <PublicLayout>
          {children}
        </PublicLayout>
      </body>
    </html>
  );
}
