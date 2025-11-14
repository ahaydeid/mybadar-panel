"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";
import SuccessAddModal from "@/app/components/SuccessAddModal";

type Props = {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
};

type ExcelRow = Record<string, string | number | null | undefined>;

export default function ImportSiswaModal({ open, onClose, onImported }: Props) {
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsedRows, setParsedRows] = useState<ExcelRow[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [showSuccessImport, setShowSuccessImport] = useState(false);

  const handleReadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);
      setParsedRows(rows);

      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (parsedRows.length === 0) {
      alert("Tidak ada data untuk import.");
      return;
    }

    setLoading(true);

    // =========================
    // MAPPING EXCEL → DATABASE
    // =========================
    const payload = parsedRows.map((r) => ({
      nama: r["Nama"] || null,
      nipd: r["NIPD"] || null,
      jk: r["JK"] || null,
      nisn: r["NISN"] || null,
      tempat_lahir: r["Tempat Lahir"] || null,
      tanggal_lahir: r["Tanggal Lahir"] || null,
      nik: r["NIK"] || null,
      agama: r["Agama"] || null,
      alamat: r["Alamat"] || null,
      rt: r["RT"] || null,
      rw: r["RW"] || null,
      kelurahan: r["Kelurahan"] || null,
      kecamatan: r["Kecamatan"] || null,
      kode_pos: r["Kode Pos"] || null,
      hp: r["HP"] || null,
      email: r["E-Mail"] || null,

      kelas_id: null,
      jurusan_id: null,
      tahun_masuk: null,
      semester: null,
      status: "AKTIF",
    }));

    const { error } = await supabase.from("siswa").insert(payload);

    if (error) {
      alert("Gagal import data siswa: " + error.message);
      console.error(error);
    }

    setLoading(false);
    setConfirmOpen(false);
    onClose();

    setShowSuccessImport(true);
    onImported();
  };

  return (
    <>
      {/* MODAL UTAMA */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Data Siswa</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* FILE UPLOADER */}
            <label htmlFor="excel-file" className="w-full border border-dashed border-sky-400 rounded p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-50 transition">
              <p className="text-sky-700 font-medium">Klik untuk memilih file Excel</p>
              <p className="text-xs text-gray-500 mt-1">Format: .xlsx</p>
            </label>

            <input id="excel-file" type="file" accept=".xlsx" className="hidden" onChange={handleReadFile} />

            {fileName && (
              <p className="text-sm text-gray-600">
                File dipilih: <span className="font-medium">{fileName}</span>
              </p>
            )}

            <div className="bg-amber-50 border border-amber-300 text-amber-700 p-3 rounded text-sm">
              <b>Penting:</b> Pastikan data siswa yang diimport <b>belum ada</b> dalam aplikasi untuk menghindari duplikasi.
            </div>

            {loading && <p className="text-blue-600 text-sm">Memproses file...</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>

            <Button className="bg-sky-600 text-white hover:bg-sky-700" disabled={parsedRows.length === 0 || loading} onClick={() => setConfirmOpen(true)}>
              Lakukan Import
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL KONFIRMASI */}
      <Dialog open={confirmOpen} onOpenChange={() => setConfirmOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Import</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700">Apakah Anda yakin ingin mengimport {parsedRows.length} data siswa?</p>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Batal
            </Button>

            <Button className="bg-sky-600 text-white hover:bg-sky-700" onClick={handleImport}>
              Ya, Import Sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL SUKSES IMPORT — HANYA TAMBAHAN INI */}
      <SuccessAddModal open={showSuccessImport} onClose={() => setShowSuccessImport(false)} message="Berhasil mengimpor data siswa." />
    </>
  );
}
