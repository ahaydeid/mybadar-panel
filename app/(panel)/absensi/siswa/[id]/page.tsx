"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import DetailLogAbsenSiswaModal from "../components/DetailLogAbsenSiswaModal";
import { CalendarPlus, FileDown } from "lucide-react";

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

export default function RekapAbsensiKelasPage() {
  const params = useParams();
  const kelasId = Number(params.id);

  const [kelasNama, setKelasNama] = useState("");
  const [list, setList] = useState<RekapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAbsensi, setTotalAbsensi] = useState(0);

  const [groupByDate, setGroupByDate] = useState<Record<string, AbsenSesi[]>>({});

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState<RekapItem | null>(null);

  const openModalDetail = (s: RekapItem) => {
    setSelectedSiswa(s);
    setOpenDetail(true);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data: kelasData } = await supabase.from("kelas").select("nama_rombel").eq("id", kelasId).single();

      setKelasNama(kelasData?.nama_rombel ?? "");

      // === 1. SISWA ===
      const { data: siswa } = await supabase.from("siswa").select("id, nama").eq("kelas_id", kelasId).order("nama");

      if (!siswa) {
        setLoading(false);
        return;
      }

      // === 2. JADWAL ===
      const { data: jadwal } = await supabase.from("jadwal").select("id").eq("kelas_id", kelasId);

      const jadwalIds = (jadwal ?? []).map((j) => j.id);

      // === 3. ABSEN ===
      const { data: absenRaw } = await supabase.from("absensi_sesi").select("jadwal_id, tanggal, sakit, izin, alfa").in("jadwal_id", jadwalIds);

      const absen: AbsenSesi[] = absenRaw ?? [];

      // === GROUP PER TANGGAL ===
      const groupByDateLocal: Record<string, AbsenSesi[]> = {};

      absen.forEach((a) => {
        if (!groupByDateLocal[a.tanggal]) groupByDateLocal[a.tanggal] = [];
        groupByDateLocal[a.tanggal].push(a);
      });

      setGroupByDate(groupByDateLocal);
      const dates = Object.keys(groupByDateLocal);

      setTotalAbsensi(dates.length);

      // === BUAT REKAP ===
      const today = new Date().toISOString().split("T")[0];

      const hasil: RekapItem[] = siswa.map((s) => {
        let sakit = 0;
        let izin = 0;
        let alfa = 0;
        let hadir = 0;

        dates.forEach((tanggal) => {
          const sesiList = groupByDateLocal[tanggal] ?? [];

          const isSakit = sesiList.some((a) => a.sakit?.includes(s.id));
          const isIzin = sesiList.some((a) => a.izin?.includes(s.id));
          const isAlfa = sesiList.some((a) => a.alfa?.includes(s.id));

          if (isSakit) sakit++;
          else if (isIzin) izin++;
          else if (isAlfa) alfa++;
          else hadir++;
        });

        // === STATUS HARI INI ===
        const sesiToday = groupByDateLocal[today] ?? [];

        let hariIni: "H" | "S" | "I" | "A" = "H";

        if (sesiToday.length > 0) {
          const isSakit = sesiToday.some((a) => a.sakit?.includes(s.id));
          const isIzin = sesiToday.some((a) => a.izin?.includes(s.id));
          const isAlfa = sesiToday.some((a) => a.alfa?.includes(s.id));

          if (isSakit) hariIni = "S";
          else if (isIzin) hariIni = "I";
          else if (isAlfa) hariIni = "A";
        }

        return {
          id: s.id,
          nama: s.nama,
          sakit,
          izin,
          alfa,
          hadir,
          hariIni,
        };
      });

      setList(hasil);
      setLoading(false);
    };

    load();
  }, [kelasId]);

  const fmtCell = (n: number) => {
    if (n === 0) return <span className="text-gray-400">-</span>;
    return <span className="font-semibold">{n}</span>;
  };

  // EXPORT ABSENSI (placeholder)
  const exportAbsensi = () => {
    alert("Fitur export belum dibuat, mau export ke Excel atau PDF?");
  };

  return (
    <div className="p-6 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">
            Rekap Absensi <span className="text-sky-600">{kelasNama}</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Total absensi: <span className="font-semibold">{totalAbsensi}</span>
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-amber-400 hover:bg-amber-500 rounded-lg flex items-center gap-2" onClick={() => alert("Backdate absen dibuka")}>
            <CalendarPlus className="w-5 h-5" />
            Tambah Absen Lampau
          </button>

          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2" onClick={exportAbsensi}>
            <FileDown className="w-5 h-5" />
            Export Absensi
          </button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-center">No</th>
              <th className="p-2 border">Nama</th>
              <th className="p-2 border bg-green-500 text-white text-center">Hadir</th>
              <th className="p-2 border bg-yellow-500 text-white text-center">Sakit</th>
              <th className="p-2 border bg-sky-500 text-white text-center">Izin</th>
              <th className="p-2 border bg-red-500 text-white text-center">Alfa</th>
              <th className="p-2 border text-center">Hari ini</th>
              <th className="p-2 border text-center">Detail</th>
            </tr>
          </thead>

          <tbody>
            {list.map((s, i) => (
              <tr key={s.id} className="border">
                <td className="p-2 border text-center">{i + 1}</td>
                <td className="p-2 border">{s.nama}</td>
                <td className="p-2 border text-center">{fmtCell(s.hadir)}</td>
                <td className="p-2 border text-center">{fmtCell(s.sakit)}</td>
                <td className="p-2 border text-center">{fmtCell(s.izin)}</td>
                <td className="p-2 border text-center">{fmtCell(s.alfa)}</td>

                <td className="p-2 border text-center">
                  {s.hariIni === "H" && <span className="px-2 py-1 bg-green-500 text-white rounded-full">H</span>}
                  {s.hariIni === "S" && <span className="px-2 py-1 bg-yellow-500 text-white rounded-full">S</span>}
                  {s.hariIni === "I" && <span className="px-2 py-1 bg-blue-500 text-white rounded-full">I</span>}
                  {s.hariIni === "A" && <span className="px-2 py-1 bg-red-500 text-white rounded-full">A</span>}
                </td>

                <td className="p-2 border text-center">
                  <button className="px-3 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700" onClick={() => openModalDetail(s)}>
                    Lihat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedSiswa && <DetailLogAbsenSiswaModal open={openDetail} onClose={() => setOpenDetail(false)} siswa={selectedSiswa} groupByDate={groupByDate} />}
    </div>
  );
}
