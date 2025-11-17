"use client";

import { useState } from "react";
import DetailLogAbsenGuruModal from "./DetailLogAbsenGuruModal";
import { RekapGuru, GuruLogHari } from "./useRekapAbsensiGuru";

export default function GuruTable({ list, logs }: { list: RekapGuru[]; logs: Record<number, GuruLogHari[]> }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<RekapGuru | null>(null);

  const fmtCell = (n: number) => (n === 0 ? <span className="text-gray-400">-</span> : <span className="font-semibold">{n}</span>);

  return (
    <>
      <table className="w-full border text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border text-center">No</th>
            <th className="p-2 border">Nama Guru</th>
            <th className="p-2 border text-center">Total Hari <span className="italic">(jadwal)</span></th>
            <th className="p-2 border bg-green-500 text-white text-center">Hadir</th>
            <th className="p-2 border bg-yellow-500 text-white text-center">Terlambat</th>
            <th className="p-2 border bg-red-500 text-white text-center">Tidak Hadir</th>
            <th className="p-2 border text-center">Hari Ini</th>
            <th className="p-2 border text-center">Detail</th>
          </tr>
        </thead>

        <tbody>
          {list.map((g, i) => (
            <tr key={g.id} className="border">
              <td className="p-2 border text-center">{i + 1}</td>
              <td className="p-2 border">{g.nama}</td>
              <td className="p-2 border text-center">{fmtCell(g.totalHari)}</td>
              <td className="p-2 border text-center">{fmtCell(g.hadir)}</td>
              <td className="p-2 border text-center">{fmtCell(g.terlambat)}</td>
              <td className="p-2 border text-center">{fmtCell(g.tidakHadir)}</td>

              <td className="p-2 border text-center">
                {g.hariIni === "H" && <span className="px-2 py-1 bg-green-500 text-white rounded-full">H</span>}
                {g.hariIni === "T" && <span className="px-2 py-1 bg-red-500 text-white rounded-full">T</span>}
                {g.hariIni === "-" && <span className="text-gray-400">-</span>}
              </td>

              <td className="p-2 border text-center">
                <button
                  className="px-3 py-1 bg-sky-600 text-white rounded"
                  onClick={() => {
                    setSelected(g);
                    setOpen(true);
                  }}
                >
                  Lihat
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && <DetailLogAbsenGuruModal open={open} onClose={() => setOpen(false)} guru={selected} logs={logs[selected.id] ?? []} />}
    </>
  );
}
