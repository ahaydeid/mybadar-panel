"use client";

import React from "react";
import { GuruLogHari, RekapGuru } from "./useRekapAbsensiGuru";

export default function DetailLogAbsenGuruModal({ open, onClose, guru, logs }: { open: boolean; onClose: () => void; guru: RekapGuru; logs: GuruLogHari[] }) {
  if (!open) return null;

  const formatLongDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // SUSUN ROWS (3 item per baris) — TETAP
  const rows: GuruLogHari[][] = [];
  for (let i = 0; i < logs.length; i += 3) {
    rows.push(logs.slice(i, i + 3));
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-sm shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button className="absolute right-3 top-3 text-gray-600 hover:text-black text-xl" onClick={onClose}>
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Detail Absensi – {guru.nama}</h2>

        <table className="w-full border text-center">
          <thead>
            <tr className="bg-gray-200 font-semibold">
              <th className="p-2 border border-gray-300">Tanggal</th>
              <th className="p-2 border border-gray-300">Jam Masuk</th>
              <th className="p-2 border border-gray-300">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-3 border text-gray-400">
                  Tidak ada data absensi.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) =>
                row.map((l, i) => (
                  <tr key={`${idx}-${i}`} className="border">
                    <td className="p-2 border">{formatLongDate(l.tanggal)}</td>
                    <td className="p-2 border">{l.jamMasuk ?? "-"}</td>
                    <td className="p-2 border font-semibold">{l.status === "HADIR" ? "Hadir" : l.status === "TERLAMBAT" ? "Terlambat" : "Alfa"}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
