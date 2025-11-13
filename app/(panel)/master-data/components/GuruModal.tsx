"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronsUpDown } from "lucide-react";

export interface GuruFormData {
  id: string;
  nama: string;
  nuptk: string;
  jk: "L" | "P";
  tempatLahir: string;
  tanggalLahir: string;
  nik: string;
  nip: string | "-";
  jenisPTK: string;
  gelar: string;
  jenjang: string;
  prodi: string;
  sertifikasi: string;
  tmtKerja: string;
  tugasTambahan: string;
  mengajar: string[];
  kompetensi: string; // Di-refaktor jadi input biasa
  status: string;
}

interface GuruModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: GuruFormData;
  onClose: () => void;
  onSubmit: (data: GuruFormData) => void;
}

const mapelList = ["Pemrograman Web", "Basis Data", "Jaringan Dasar", "Bahasa Indonesia", "Matematika", "Akuntansi Dasar", "Simulasi Digital", "Produktif RPL"];

export default function GuruModal({ open, mode, initialData, onClose, onSubmit }: GuruModalProps) {
  const [form, setForm] = React.useState<GuruFormData>({
    id: "",
    nama: "",
    nuptk: "",
    jk: "L",
    tempatLahir: "",
    tanggalLahir: "",
    nik: "",
    nip: "-",
    jenisPTK: "",
    gelar: "",
    jenjang: "",
    prodi: "",
    sertifikasi: "",
    tmtKerja: "",
    tugasTambahan: "",
    mengajar: [],
    kompetensi: "",
    status: "Aktif",
  });

  React.useEffect(() => {
    if (mode === "edit" && initialData) setForm(initialData);
  }, [mode, initialData]);

  const addMengajar = (mapel: string) => {
    if (!form.mengajar.includes(mapel)) {
      setForm({ ...form, mengajar: [...form.mengajar, mapel] });
    }
  };

  const removeMengajar = (mapel: string) => {
    setForm({ ...form, mengajar: form.mengajar.filter((m) => m !== mapel) });
  };

  const handleSubmit = () => {
    if (!form.nama.trim()) return;
    onSubmit({ ...form, id: form.nuptk || crypto.randomUUID() });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Guru" : "Edit Guru"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* NAMA */}
          <div>
            <label className="text-sm font-medium">Nama Lengkap</label>
            <Input placeholder="Contoh: Ahmad Fauzi" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
          </div>

          {/* NUPTK */}
          <div>
            <label className="text-sm font-medium">NUPTK</label>
            <Input placeholder="Contoh: 4162xxxxxxxx" value={form.nuptk} onChange={(e) => setForm({ ...form, nuptk: e.target.value })} />
          </div>

          {/* JK */}
          <div>
            <label className="text-sm font-medium">Jenis Kelamin</label>
            <Select value={form.jk} onValueChange={(v) => setForm({ ...form, jk: v as "L" | "P" })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Laki-laki</SelectItem>
                <SelectItem value="P">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* TEMPAT LAHIR */}
          <div>
            <label className="text-sm font-medium">Tempat Lahir</label>
            <Input placeholder="Contoh: Tangerang" value={form.tempatLahir} onChange={(e) => setForm({ ...form, tempatLahir: e.target.value })} />
          </div>

          {/* TANGGAL LAHIR */}
          <div>
            <label className="text-sm font-medium">Tanggal Lahir</label>
            <Input type="date" value={form.tanggalLahir} onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })} />
          </div>

          {/* NIK */}
          <div>
            <label className="text-sm font-medium">NIK</label>
            <Input placeholder="Contoh: 3603xxxxxxxxxxxx" value={form.nik} onChange={(e) => setForm({ ...form, nik: e.target.value })} />
          </div>

          {/* NIP */}
          <div>
            <label className="text-sm font-medium">NIP</label>
            <Input placeholder="Jika tidak ada isi '-'" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} />
          </div>

          {/* Jenis PTK */}
          <div>
            <label className="text-sm font-medium">Jenis PTK</label>
            <Input placeholder="Contoh: Guru Mapel / Guru BK" value={form.jenisPTK} onChange={(e) => setForm({ ...form, jenisPTK: e.target.value })} />
          </div>

          {/* Gelar */}
          <div>
            <label className="text-sm font-medium">Gelar</label>
            <Input placeholder="Contoh: S.Pd / M.Pd" value={form.gelar} onChange={(e) => setForm({ ...form, gelar: e.target.value })} />
          </div>

          {/* Jenjang */}
          <div>
            <label className="text-sm font-medium">Jenjang Pendidikan</label>
            <Input placeholder="Contoh: S1 / S2" value={form.jenjang} onChange={(e) => setForm({ ...form, jenjang: e.target.value })} />
          </div>

          {/* Prodi */}
          <div>
            <label className="text-sm font-medium">Jurusan / Prodi</label>
            <Input placeholder="Contoh: Pendidikan Informatika" value={form.prodi} onChange={(e) => setForm({ ...form, prodi: e.target.value })} />
          </div>

          {/* Sertifikasi */}
          <div>
            <label className="text-sm font-medium">Sertifikasi</label>
            <Input placeholder="Contoh: PPG Dalam Jabatan" value={form.sertifikasi} onChange={(e) => setForm({ ...form, sertifikasi: e.target.value })} />
          </div>

          {/* TMT */}
          <div>
            <label className="text-sm font-medium">TMT Kerja</label>
            <Input type="date" value={form.tmtKerja} onChange={(e) => setForm({ ...form, tmtKerja: e.target.value })} />
          </div>

          {/* TUGAS TAMBAHAN */}
          <div>
            <label className="text-sm font-medium">Tugas Tambahan</label>
            <Input placeholder="Contoh: Wali Kelas, Ketua Jurusan, atau '-'" value={form.tugasTambahan} onChange={(e) => setForm({ ...form, tugasTambahan: e.target.value })} />
          </div>

          {/* MULTI SELECT MENGAJAR */}
          <div>
            <label className="text-sm font-medium">Mengajar (Mapel)</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Tambah Mapel
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari mapel..." />
                  <CommandList>
                    <CommandEmpty>Tidak ditemukan</CommandEmpty>
                    <CommandGroup>
                      {mapelList.map((m) => (
                        <CommandItem key={m} value={m} onSelect={() => addMengajar(m)}>
                          {m}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Chip List */}
            <div className="flex flex-wrap gap-2 mt-2">
              {form.mengajar.map((m) => (
                <span key={m} className="bg-sky-100 px-2 py-1 text-xs rounded-full flex items-center gap-2">
                  {m}
                  <button onClick={() => removeMengajar(m)} className="text-red-600 hover:text-red-800">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* KOMPETENSI */}
          <div>
            <label className="text-sm font-medium">Kompetensi</label>
            <Input placeholder="Contoh: Web Developer / Jaringan / Akuntansi" value={form.kompetensi} onChange={(e) => setForm({ ...form, kompetensi: e.target.value })} />
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm font-medium">Status Kepegawaian</label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={handleSubmit}>
            {mode === "add" ? "Tambah" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
