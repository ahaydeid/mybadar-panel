"use client";

import useRekapAbsensiGuru from "./components/useRekapAbsensiGuru";
import GuruTable from "./components/GuruTable";
import { CalendarPlus, FileDown } from "lucide-react";

export default function RekapAbsensiGuruPage() {
  const { list, logs, loading, errorMsg, totalHariEfektif } = useRekapAbsensiGuru();

  const exportAbsensi = () => alert("Export belum dibuat");

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            Rekap Absensi <span className="text-sky-600">Guru</span>
          </h1>
          <p className="text-gray-600">
            Hari efektif semester: <span className="font-semibold">{totalHariEfektif} hari</span>
          </p>
          {errorMsg && <p className="text-red-600">{errorMsg}</p>}
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-amber-400 rounded-lg flex items-center gap-2">
            <CalendarPlus className="w-5 h-5" /> Tambah Absen Lampau
          </button>

          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2" onClick={exportAbsensi}>
            <FileDown className="w-5 h-5" /> Export Absensi
          </button>
        </div>
      </div>

      {loading ? <p>Loading…</p> : <GuruTable list={list} logs={logs} />}
    </div>
  );
}
