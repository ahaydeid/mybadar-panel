// app/(panel)/hari-ini/page.tsx
"use client";

import { useState } from "react";
import KegiatanBelajar from "./components/KegiatanBelajar";
import AbsensiGuru from "./components/AbsensiGuru";

export default function HariIniPage() {
  const [activeTab, setActiveTab] = useState<"kegiatan" | "absen">("kegiatan");

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Hari Ini</h1>

        {/* Navigasi Tab */}
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("kegiatan")} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "kegiatan" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
            Kegiatan Belajar
          </button>

          <button onClick={() => setActiveTab("absen")} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === "absen" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}>
            Absen Guru
          </button>
        </div>
      </header>

      {/* Konten */}
      {activeTab === "kegiatan" ? <KegiatanBelajar /> : <AbsensiGuru />}
    </div>
  );
}
