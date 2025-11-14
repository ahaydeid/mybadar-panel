"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase/client";
import { UploadCloud } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
};

type ExcelRow = Record<string, string | number | null | undefined>;

export default function ImportGuruModal({ open, onClose, onImported }: Props) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);

  // ==========================
  // HANDLE FILE SELECT
  // ==========================
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const buffer = await file.arrayBuffer();
    setFileData(buffer);
  };

  // ==========================
  // IMPORT PROCESS
  // ==========================
  const processImport = async () => {
    if (!fileData) return;

    setLoading(true);

    const workbook = XLSX.read(fileData, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

    const payload = rows.map((r) => ({
      nama: r["Nama"] || null,
      nuptk: r["NUPTK"] || null,
      jk: r["JK"] || null,
      tempat_lahir: r["Tempat Lahir"] || null,
      tanggal_lahir: r["Tanggal Lahir"] || null,
      nik: r["NIK"] || null,
      nip: r["NIP"] || null,
      jenis_ptk: r["Jenis PTK"] || null,
      gelar: r["Gelar Belakang"] || null,
      jenjang: r["Jenjang"] || null,
      prodi: r["Jurusan/Prodi"] || null,
      sertifikasi: r["Sertifikasi"] || null,
      tmt_kerja: r["TMT Kerja"] || null,
      tugas_tambahan: r["Tugas Tambahan"] || null,
      kompetensi: r["Kompetensi"] || null,
      status: "ACTIVE",
    }));

    const { error } = await supabase.from("guru").insert(payload);

    if (error) {
      console.error("Import error:", error);
      alert("Gagal import data guru. Periksa format kolom.");
    } else {
      onImported();
    }

    setLoading(false);
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      {/* ==============================
          MAIN IMPORT MODAL
      ============================== */}
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Import Data Guru</DialogTitle>
          </DialogHeader>

          {/* UPLOAD AREA */}
          <label htmlFor="guru-file-upload" className="mt-2 border-2 border-dashed border-sky-400 bg-sky-50 hover:bg-sky-100 transition cursor-pointer rounded-lg p-6 flex flex-col items-center text-center">
            <UploadCloud className="w-10 h-10 text-sky-600 mb-2" />
            <p className="text-sky-700 font-medium">Klik untuk memilih file Excel</p>
            <p className="text-gray-500 text-sm">Format: .xlsx</p>

            <input id="guru-file-upload" type="file" accept=".xlsx" className="hidden" onChange={handleFile} />
          </label>

          {fileName !== "" && (
            <p className="text-sm mt-3 text-gray-700">
              <span className="font-medium">File dipilih:</span> {fileName}
            </p>
          )}

          {/* WARNING BOX */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded text-amber-800 text-sm">
            <strong>Perhatian:</strong>
            <br />
            Pastikan data guru yang Anda import <b>belum ada di aplikasi</b>.
            <br />
            Jika duplikat dimasukkan, data bisa menjadi ganda.
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>

            <Button disabled={!fileData} className="bg-sky-600 hover:bg-sky-700 text-white" onClick={() => setShowConfirm(true)}>
              Lakukan Import
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ==============================
          CONFIRMATION MODAL
      ============================== */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Konfirmasi Import</DialogTitle>
          </DialogHeader>

          <p className="text-gray-700">
            Apakah Anda yakin ingin mengimport data guru dari file:
            <br />
            <strong>{fileName}</strong> ?
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Batal
            </Button>

            <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={processImport} disabled={loading}>
              {loading ? "Mengimpor..." : "Ya, Lakukan Import"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
