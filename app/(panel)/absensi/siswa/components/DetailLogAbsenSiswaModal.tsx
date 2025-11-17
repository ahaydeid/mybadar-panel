"use client";

import React from "react";

type AbsenSesi = {
  tanggal: string;
  jadwal_id: number;
  sakit: number[] | null;
  izin: number[] | null;
  alfa: number[] | null;
};

type RekapItem = {
  id: number;
  nama: string;
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  hariIni: "H" | "S" | "I" | "A";
};

interface Props {
  open: boolean;
  onClose: () => void;
  siswa: RekapItem;
  groupByDate: Record<string, AbsenSesi[]>;
}

export default function DetailLogAbsenSiswaModal({ open, onClose, siswa, groupByDate }: Props) {
  if (!open) return null;

  // === 1. Kumpulkan data per tanggal ===
  const hadirTanggal: string[] = [];
  const sakitTanggal: string[] = [];
  const izinTanggal: string[] = [];
  const alfaTanggal: string[] = [];

  Object.entries(groupByDate).forEach(([tanggal, sesiList]) => {
    const isSakit = sesiList.some((s) => s.sakit?.includes(siswa.id));
    const isIzin = sesiList.some((s) => s.izin?.includes(siswa.id));
    const isAlfa = sesiList.some((s) => s.alfa?.includes(siswa.id));

    if (isSakit) sakitTanggal.push(tanggal);
    else if (isIzin) izinTanggal.push(tanggal);
    else if (isAlfa) alfaTanggal.push(tanggal);
    else hadirTanggal.push(tanggal);
  });

  // === 2. Format tanggal DD/Mon/YYYY ===
  const fmtDate = (iso: string): string => {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return iso;

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // === 3. Siapkan array baris ===
  type Row = {
    hadir: string | null;
    sakit: string | null;
    izin: string | null;
    alfa: string | null;
  };

  const rows: Row[] = [];

  const maxLen = Math.max(hadirTanggal.length, sakitTanggal.length, izinTanggal.length, alfaTanggal.length);

  for (let i = 0; i < maxLen; i++) {
    rows.push({
      hadir: hadirTanggal[i] ? fmtDate(hadirTanggal[i]) : null,
      sakit: sakitTanggal[i] ? fmtDate(sakitTanggal[i]) : null,
      izin: izinTanggal[i] ? fmtDate(izinTanggal[i]) : null,
      alfa: alfaTanggal[i] ? fmtDate(alfaTanggal[i]) : null,
    });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-sm shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button className="absolute right-3 top-3 text-gray-600 hover:text-black text-xl" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Detail Absensi – {siswa.nama}</h2>

        <table className="w-full border text-center">
          <thead>
            <tr className="bg-gray-200 font-semibold">
              <th className="p-2 border border-gray-300">Hadir</th>
              <th className="p-2 border border-gray-300">Sakit</th>
              <th className="p-2 border border-gray-300">Izin</th>
              <th className="p-2 border border-gray-300">Alfa</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="p-2 border text-gray-400" colSpan={4}>
                  Tidak ada data absensi.
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i}>
                  <td className="p-2 border">{row.hadir ?? "-"}</td>
                  <td className="p-2 border">{row.sakit ?? "-"}</td>
                  <td className="p-2 border">{row.izin ?? "-"}</td>
                  <td className="p-2 border">{row.alfa ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
