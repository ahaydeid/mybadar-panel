"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";

export interface SiswaFormData {
  id?: string;
  nama: string;
  nipd: string;
  nisn: string;
  jk: "L" | "P";
  tempatLahir: string;
  tanggalLahir: string;
  nik: string;
  agama: string;
  alamat: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  kodePos: string;

  kelasId: string;
  jurusanId: string;

  tahunMasuk: number | string;
  semester: number | string;
  status: string;
  hp: string;
  email: string;
}

interface Props {
  open: boolean;
  mode: "add" | "edit";
  initialData?: SiswaFormData;
  onClose: () => void;
  onSubmit: (data: SiswaFormData) => void;
}

export default function SiswaModal({ open, mode, initialData, onClose, onSubmit }: Props) {
  // ===========================
  // FORM STATE
  // ===========================
  const [form, setForm] = useState<SiswaFormData>({
    nama: "",
    nipd: "",
    nisn: "",
    jk: "L",
    tempatLahir: "",
    tanggalLahir: "",
    nik: "",
    agama: "ISLAM",
    alamat: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    kodePos: "",
    kelasId: "",
    jurusanId: "",
    tahunMasuk: "",
    semester: "",
    status: "AKTIF",
    hp: "",
    email: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // ===========================
  // DROPDOWN DATA
  // ===========================
  const [kelasList, setKelasList] = useState<{ id: number; nama_rombel: string }[]>([]);
  const [jurusanList, setJurusanList] = useState<{ id: number; kode: string }[]>([]);

  // ===========================
  // FETCH KELAS & JURUSAN
  // ===========================
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      const [{ data: kelas }, { data: jurusan }] = await Promise.all([supabase.from("kelas").select("id, nama_rombel"), supabase.from("jurusan").select("id, kode")]);

      setKelasList(kelas ?? []);
      setJurusanList(jurusan ?? []);
    };

    load();
  }, [open]);

  // ===========================
  // RESET / FILL FORM
  // ===========================
  useEffect(() => {
    if (!open) return;

    queueMicrotask(() => {
      if (mode === "edit" && initialData) {
        setForm({ ...initialData });
      } else {
        setForm({
          nama: "",
          nipd: "",
          nisn: "",
          jk: "L",
          tempatLahir: "",
          tanggalLahir: "",
          nik: "",
          agama: "ISLAM",
          alamat: "",
          rt: "",
          rw: "",
          kelurahan: "",
          kecamatan: "",
          kodePos: "",
          kelasId: "",
          jurusanId: "",
          tahunMasuk: "",
          semester: "",
          status: "AKTIF",
          hp: "",
          email: "",
        });
      }
    });
  }, [open, mode, initialData]);

  // ===========================
  // UPDATE FIELD
  // ===========================
  const updateField = (key: keyof SiswaFormData, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));

  // ===========================
  // SUBMIT
  // ===========================
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.nama.trim()) newErrors.nama = "Nama wajib diisi.";
    if (!form.nik.trim()) newErrors.nik = "NIK wajib diisi.";
    if (!form.nisn.trim()) newErrors.nisn = "NISN wajib diisi.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Siswa" : "Edit Siswa"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <Input placeholder="Nama" value={form.nama} onChange={(e) => updateField("nama", e.target.value)} />
          {errors.nama && <p className="text-red-500 text-xs">{errors.nama}</p>}

          <Input placeholder="NIPD" value={form.nipd} onChange={(e) => updateField("nipd", e.target.value)} />

          <Input placeholder="NISN" value={form.nisn} onChange={(e) => updateField("nisn", e.target.value)} />
          {errors.nisn && <p className="text-red-500 text-xs">{errors.nisn}</p>}

          {/* JENIS KELAMIN */}
          <Select value={form.jk} onValueChange={(v) => updateField("jk", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Tempat Lahir" value={form.tempatLahir} onChange={(e) => updateField("tempatLahir", e.target.value)} />

          <Input type="date" value={form.tanggalLahir} onChange={(e) => updateField("tanggalLahir", e.target.value)} />

          <Input placeholder="NIK" value={form.nik} onChange={(e) => updateField("nik", e.target.value)} />
          {errors.nik && <p className="text-red-500 text-xs">{errors.nik}</p>}

          {/* AGAMA ENUM */}
          <Select value={form.agama} onValueChange={(v) => updateField("agama", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Agama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ISLAM">Islam</SelectItem>
              <SelectItem value="KRISTEN">Kristen</SelectItem>
              <SelectItem value="KATOLIK">Katolik</SelectItem>
              <SelectItem value="HINDU">Hindu</SelectItem>
              <SelectItem value="BUDDHA">Buddha</SelectItem>
              <SelectItem value="KONGHUCU">Konghucu</SelectItem>
              <SelectItem value="LAINNYA">Lainnya</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Alamat" value={form.alamat} onChange={(e) => updateField("alamat", e.target.value)} />

          <Input placeholder="RT" value={form.rt} onChange={(e) => updateField("rt", e.target.value)} />

          <Input placeholder="RW" value={form.rw} onChange={(e) => updateField("rw", e.target.value)} />

          <Input placeholder="Kelurahan" value={form.kelurahan} onChange={(e) => updateField("kelurahan", e.target.value)} />

          <Input placeholder="Kecamatan" value={form.kecamatan} onChange={(e) => updateField("kecamatan", e.target.value)} />

          <Input placeholder="Kode Pos" value={form.kodePos} onChange={(e) => updateField("kodePos", e.target.value)} />

          {/* KELAS */}
          <Select value={form.kelasId} onValueChange={(v) => updateField("kelasId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              {kelasList.map((k) => (
                <SelectItem key={k.id} value={k.id.toString()}>
                  {k.nama_rombel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* JURUSAN */}
          <Select value={form.jurusanId} onValueChange={(v) => updateField("jurusanId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Jurusan" />
            </SelectTrigger>
            <SelectContent>
              {jurusanList.map((j) => (
                <SelectItem key={j.id} value={j.id.toString()}>
                  {j.kode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input type="number" placeholder="Tahun Masuk" value={form.tahunMasuk} onChange={(e) => updateField("tahunMasuk", e.target.value)} />

          <Input type="number" placeholder="Semester" value={form.semester} onChange={(e) => updateField("semester", e.target.value)} />

          {/* STATUS ENUM */}
          <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AKTIF">Aktif</SelectItem>
              <SelectItem value="LULUS">Lulus</SelectItem>
              <SelectItem value="PINDAH">Pindah</SelectItem>
              <SelectItem value="DO">Drop Out</SelectItem>
              <SelectItem value="CUTI">Cuti</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="HP" value={form.hp} onChange={(e) => updateField("hp", e.target.value)} />

          <Input placeholder="Email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>

          <Button onClick={handleSubmit} className="bg-sky-600 text-white">
            {mode === "add" ? "Tambah" : "Simpan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
