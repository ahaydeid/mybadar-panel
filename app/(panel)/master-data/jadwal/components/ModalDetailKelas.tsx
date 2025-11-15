"use client";

import React from "react";

export type JadwalItem = {
  kelas_id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  mapel: string;
  guru: string | null;
  warna: string;
};

interface ModalDetailKelasProps {
  open: boolean;
  onClose: () => void;
  nama_kelas: string;
  wali_kelas: string | null;
  jadwalList: JadwalItem[];
}

export default function ModalDetailKelas({ open, onClose, nama_kelas, wali_kelas, jadwalList }: ModalDetailKelasProps) {
  if (!open) return null;

  const grouped = jadwalList.reduce<Record<string, JadwalItem[]>>((acc, j) => {
    if (!acc[j.hari]) acc[j.hari] = [];
    acc[j.hari].push(j);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white mt-10 mb-10 w-[95vw] max-w-[1500px] rounded-2xl shadow-xl p-10">
        <div className="flex justify-between items-center border-b pb-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold">Jadwal Kelas {nama_kelas}</h2>
            <p className="text-gray-500">Wali Kelas: <span className="text-lg font-bold">{wali_kelas ?? "Tidak ada"}</span></p>
          </div>

          <button onClick={onClose} className="w-10 h-10 rounded-full border flex items-center justify-center text-gray-600 hover:bg-gray-100">
            ×
          </button>
        </div>

        {jadwalList.length === 0 && <p className="text-center text-gray-400 py-16">Belum ada jadwal untuk kelas ini.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(grouped).map(([hari, list]) => (
            <div key={hari} className="bg-gray-50 border rounded-md shadow-sm p-3">
              <h3 className="text-xl font-bold mb-4">{hari}</h3>

              <div className="space-y-1">
                {list.map((j, idx) => (
                  <div key={idx} className="w-full rounded flex items-center text-sm font-medium text-white text-shadow-2xs" style={{ backgroundColor: j.warna }}>
                    {/* JAM */}
                    <div className="w-28 px-2 py-2 text-[12px] font-semibold border-r border-black/10">
                      {j.jam_mulai} - {j.jam_selesai}
                    </div>

                    {/* MAPEL */}
                    <div className="flex-1 px-3 py-2 uppercase font-bold text-[13px]">{j.mapel}</div>

                    {/* GURU */}
                    <div className="w-28 px-3 py-2 text-right text-[12px]">{j.guru ?? "-"}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
