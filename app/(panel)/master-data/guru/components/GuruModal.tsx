"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase/client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { ChevronsUpDown } from "lucide-react";

// ===================================================
// TYPE (camelCase, sesuai page.tsx)
// ===================================================
export interface GuruFormData {
  id?: number;
  nama: string;
  nuptk: string;
  jk: "L" | "P";

  tempatLahir: string;
  tanggalLahir: string;

  nik: string;
  nip: string;

  jenisPTK: string;
  gelar: string;
  jenjang: string;
  prodi: string;
  sertifikasi: string;

  tmtKerja: string;
  tugasTambahan: string;

  kompetensi: string;
  status: "ACTIVE" | "INACTIVE";

  mapelIds: number[];
}

interface MapelItem {
  id: number;
  nama: string;
}

interface GuruModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: GuruFormData;
  onClose: () => void;
  onSubmit: (data: GuruFormData) => void;
}

// ===================================================
// DEFAULT FORM (camelCase)
// ===================================================
const defaultForm: GuruFormData = {
  id: undefined,
  nama: "",
  nuptk: "",
  jk: "L",

  tempatLahir: "",
  tanggalLahir: "",

  nik: "",
  nip: "",
  jenisPTK: "",
  gelar: "",
  jenjang: "",
  prodi: "",
  sertifikasi: "",
  tmtKerja: "",
  tugasTambahan: "",
  kompetensi: "",
  status: "ACTIVE",

  mapelIds: [],
};

// ===================================================
// GURU MODAL
// ===================================================
export default function GuruModal({ open, mode, initialData, onClose, onSubmit }: GuruModalProps) {
  const [form, setForm] = React.useState<GuruFormData>(defaultForm);
  const [mapelList, setMapelList] = React.useState<MapelItem[]>([]);

  // Load mapel
  const loadMapel = React.useCallback(async () => {
    const { data } = await supabase.from("mata_pelajaran").select("id, nama").order("nama");

    if (data) {
      setMapelList(
        data.map((i) => ({
          id: i.id as number,
          nama: i.nama as string,
        }))
      );
    }
  }, []);

  React.useEffect(() => {
    if (open) loadMapel();
  }, [open, loadMapel]);

  React.useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setForm({
        ...defaultForm,
        ...initialData,
        mapelIds: initialData.mapelIds ?? [],
      });
    } else if (mode === "add") {
      setForm(defaultForm);
    }
  }, [open, mode, initialData]);

  // Tambah / Hapus mapel
  const addMapel = (id: number) => {
    setForm((prev) => (prev.mapelIds.includes(id) ? prev : { ...prev, mapelIds: [...prev.mapelIds, id] }));
  };

  const removeMapel = (id: number) => {
    setForm((prev) => ({
      ...prev,
      mapelIds: prev.mapelIds.filter((x) => x !== id),
    }));
  };

  // Submit
  const handleSubmit = () => {
    if (!form.nama.trim()) return;

    // Prevent date="" → Supabase error
    const clean = {
      ...form,
      tanggalLahir: form.tanggalLahir || null,
      tmtKerja: form.tmtKerja || null,
    };

    onSubmit(clean as GuruFormData);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Guru" : "Edit Guru"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* NAMA */}
          <div>
            <label className="text-sm font-medium">Nama Lengkap</label>
            <Input value={form.nama} onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))} />
          </div>

          {/* NUPTK */}
          <div>
            <label className="text-sm font-medium">NUPTK</label>
            <Input value={form.nuptk} onChange={(e) => setForm((p) => ({ ...p, nuptk: e.target.value }))} />
          </div>

          {/* JK */}
          <div>
            <label className="text-sm font-medium">Jenis Kelamin</label>
            <Select value={form.jk} onValueChange={(v) => setForm((p) => ({ ...p, jk: v as "L" | "P" }))}>
              <SelectTrigger>
                <SelectValue />
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
            <Input value={form.tempatLahir} onChange={(e) => setForm((p) => ({ ...p, tempatLahir: e.target.value }))} />
          </div>

          {/* TANGGAL LAHIR */}
          <div>
            <label className="text-sm font-medium">Tanggal Lahir</label>
            <Input type="date" value={form.tanggalLahir} onChange={(e) => setForm((p) => ({ ...p, tanggalLahir: e.target.value }))} />
          </div>

          {/* NIK */}
          <div>
            <label className="text-sm font-medium">NIK</label>
            <Input value={form.nik} onChange={(e) => setForm((p) => ({ ...p, nik: e.target.value }))} />
          </div>

          {/* NIP */}
          <div>
            <label className="text-sm font-medium">NIP</label>
            <Input value={form.nip} onChange={(e) => setForm((p) => ({ ...p, nip: e.target.value }))} />
          </div>

          {/* JENIS PTK */}
          <div>
            <label className="text-sm font-medium">Jenis PTK</label>
            <Input value={form.jenisPTK} onChange={(e) => setForm((p) => ({ ...p, jenisPTK: e.target.value }))} />
          </div>

          {/* GELAR */}
          <div>
            <label className="text-sm font-medium">Gelar</label>
            <Input value={form.gelar} onChange={(e) => setForm((p) => ({ ...p, gelar: e.target.value }))} />
          </div>

          {/* JENJANG */}
          <div>
            <label className="text-sm font-medium">Jenjang</label>
            <Input value={form.jenjang} onChange={(e) => setForm((p) => ({ ...p, jenjang: e.target.value }))} />
          </div>

          {/* PRODI */}
          <div>
            <label className="text-sm font-medium">Prodi</label>
            <Input value={form.prodi} onChange={(e) => setForm((p) => ({ ...p, prodi: e.target.value }))} />
          </div>

          {/* SERTIFIKASI */}
          <div>
            <label className="text-sm font-medium">Sertifikasi</label>
            <Input value={form.sertifikasi} onChange={(e) => setForm((p) => ({ ...p, sertifikasi: e.target.value }))} />
          </div>

          {/* TMT */}
          <div>
            <label className="text-sm font-medium">TMT Kerja</label>
            <Input type="date" value={form.tmtKerja} onChange={(e) => setForm((p) => ({ ...p, tmtKerja: e.target.value }))} />
          </div>

          {/* TUGAS TAMBAHAN */}
          <div>
            <label className="text-sm font-medium">Tugas Tambahan</label>
            <Input value={form.tugasTambahan} onChange={(e) => setForm((p) => ({ ...p, tugasTambahan: e.target.value }))} />
          </div>

          {/* MAPEL MULTI */}
          <div>
            <label className="text-sm font-medium">Mengajar (Mapel)</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Pilih Mapel
                  <ChevronsUpDown className="w-4 h-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari mapel..." />
                  <CommandList>
                    <CommandEmpty>Tidak ditemukan</CommandEmpty>
                    <CommandGroup>
                      {mapelList.map((m) => (
                        <CommandItem key={m.id} value={m.nama} onSelect={() => addMapel(m.id)}>
                          {m.nama}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="flex flex-wrap gap-2 mt-2">
              {form.mapelIds.map((id) => {
                const item = mapelList.find((x) => x.id === id);
                if (!item) return null;

                return (
                  <span key={id} className="bg-sky-100 px-2 py-1 text-xs rounded-full flex items-center gap-2">
                    {item.nama}
                    <button onClick={() => removeMapel(id)} className="text-red-600 hover:text-red-800">
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          {/* KOMPETENSI */}
          <div>
            <label className="text-sm font-medium">Kompetensi</label>
            <Input value={form.kompetensi} onChange={(e) => setForm((p) => ({ ...p, kompetensi: e.target.value }))} />
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as "ACTIVE" | "INACTIVE" }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="INACTIVE">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>

          <Button onClick={handleSubmit} className="bg-sky-600 hover:bg-sky-700 text-white">
            {mode === "add" ? "Tambah" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
