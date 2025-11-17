"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface SemesterFormData {
  id: number | null;
  namaSemester: string;
  tahunAjaran: string;
  jenis: "Ganjil" | "Genap";
  status: "Aktif" | "Tidak Aktif";
  tanggalMulai: string;
  tanggalSelesai: string;
}

interface Props {
  open: boolean;
  mode: "add" | "edit";
  initialData?: SemesterFormData;
  onClose: () => void;
  onSubmit: (data: SemesterFormData) => void;
}

export default function SemesterModal({ open, mode, initialData, onClose, onSubmit }: Props) {
  const [form, setForm] = React.useState<SemesterFormData>({
    id: null,
    namaSemester: "",
    tahunAjaran: "",
    jenis: "Ganjil",
    status: "Aktif",
    tanggalMulai: "",
    tanggalSelesai: "",
  });

  const [tahunAwal, setTahunAwal] = React.useState("");
  const [tahunAkhir, setTahunAkhir] = React.useState("");

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setForm(initialData);

      const [awal, akhir] = initialData.tahunAjaran.split("/");
      setTahunAwal(awal);
      setTahunAkhir(akhir);
    } else {
      setForm({
        id: null,
        namaSemester: "",
        tahunAjaran: "",
        jenis: "Ganjil",
        status: "Aktif",
        tanggalMulai: "",
        tanggalSelesai: "",
      });

      setTahunAwal("");
      setTahunAkhir("");
    }

    setErrors({});
  }, [open, mode, initialData]);

  // AUTO GENERATE TAHUN AKHIR
  const handleTahunAwalChange = (value: string) => {
    setTahunAwal(value);

    // Ketika tahun awal valid → auto year end
    if (/^\d{4}$/.test(value)) {
      const next = (Number(value) + 1).toString();
      setTahunAkhir(next);
    } else {
      setTahunAkhir("");
    }
  };

  // VALIDASI
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.namaSemester.trim()) newErrors.namaSemester = "Nama semester wajib diisi.";

    // Validasi hanya tahun awal (akhir otomatis)
    if (!tahunAwal.trim()) newErrors.tahunAwal = "Tahun awal wajib diisi.";

    if (tahunAwal && !/^\d{4}$/.test(tahunAwal)) newErrors.tahunAwal = "Tahun harus 4 digit angka.";

    // Validasi tahun akhir otomatis
    if (tahunAwal && /^\d{4}$/.test(tahunAwal)) {
      const expected = Number(tahunAwal) + 1;
      if (tahunAkhir !== expected.toString()) {
        newErrors.tahunAwal = "Tahun awal invalid — tahun akhir otomatis tidak cocok.";
      }
    }

    if (!form.jenis) newErrors.jenis = "Jenis semester wajib diisi.";
    if (!form.status) newErrors.status = "Status wajib diisi.";
    if (!form.tanggalMulai) newErrors.tanggalMulai = "Tanggal mulai wajib diisi.";
    if (!form.tanggalSelesai) newErrors.tanggalSelesai = "Tanggal selesai wajib diisi.";

    if (form.tanggalMulai && form.tanggalSelesai) {
      const mulai = new Date(form.tanggalMulai);
      const selesai = new Date(form.tanggalSelesai);

      if (selesai <= mulai) newErrors.tanggalSelesai = "Tanggal selesai harus lebih besar dari tanggal mulai.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      ...form,
      tahunAjaran: `${tahunAwal}/${tahunAkhir}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Semester" : "Edit Semester"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* NAMA & TAHUN AJARAN */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nama Semester */}
            <div>
              <label className="text-sm font-medium">Nama Semester</label>
              <Input value={form.namaSemester} onChange={(e) => setForm({ ...form, namaSemester: e.target.value })} />
              {errors.namaSemester && <p className="text-red-500 text-xs">{errors.namaSemester}</p>}
            </div>

            {/* Tahun Ajaran */}
            <div>
              <label className="text-sm font-medium">Tahun Ajaran</label>

              <div className="flex gap-2">
                <Input placeholder="2025" value={tahunAwal} onChange={(e) => handleTahunAwalChange(e.target.value)} maxLength={4} />

                <span className="self-center font-semibold">/</span>

                <Input placeholder="2026" value={tahunAkhir} readOnly className="" />
              </div>

              {errors.tahunAwal && <p className="text-red-500 text-xs">{errors.tahunAwal}</p>}
            </div>
          </div>

          {/* Tanggal Mulai / Selesai */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tanggal Mulai</label>
              <Input type="date" value={form.tanggalMulai} onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })} />
              {errors.tanggalMulai && <p className="text-red-500 text-xs">{errors.tanggalMulai}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Tanggal Selesai</label>
              <Input type="date" value={form.tanggalSelesai} onChange={(e) => setForm({ ...form, tanggalSelesai: e.target.value })} />
              {errors.tanggalSelesai && <p className="text-red-500 text-xs">{errors.tanggalSelesai}</p>}
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "Aktif" | "Tidak Aktif" })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button className="bg-sky-600 text-white" onClick={handleSubmit}>
            {mode === "add" ? "Tambah" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
