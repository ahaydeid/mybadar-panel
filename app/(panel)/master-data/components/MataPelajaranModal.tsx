"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// =====================
// Dummy data Jurusan SMK
// =====================
const jurusanList = ["RPL", "TKJ", "MM", "AKL"];

// =====================
// TIPE DATA
// =====================
export interface MapelFormData {
  id: string;
  kode: string;
  nama: string;
  kategori: "Umum" | "C1" | "C2" | "C3";
  tingkat: "X" | "XI" | "XII";
  jurusan: string[];
  jp: number;
  status: "Aktif" | "Tidak Aktif";
}

interface MapelModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: MapelFormData;
  onClose: () => void;
  onSubmit: (data: MapelFormData) => void;
}

// =====================
// COMPONENT
// =====================
export default function MataPelajaranModal({ open, mode, initialData, onClose, onSubmit }: MapelModalProps) {
  const [form, setForm] = React.useState<MapelFormData>({
    id: "",
    kode: "",
    nama: "",
    kategori: "Umum",
    tingkat: "X",
    jurusan: [],
    jp: 2,
    status: "Aktif",
  });

  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: "",
        kode: "",
        nama: "",
        kategori: "Umum",
        tingkat: "X",
        jurusan: [],
        jp: 2,
        status: "Aktif",
      });
    }
  }, [mode, initialData]);

  // Auto-generate KODE MAPEL
  React.useEffect(() => {
    if (!form.nama.trim()) return;

    const sanitized = form.nama.toUpperCase().replace(/[^A-Z0-9]/g, "-");

    setForm((prev) => ({
      ...prev,
      kode: `${sanitized}-${form.kategori}`,
    }));
  }, [form.nama, form.kategori]);

  const toggleJurusan = (j: string) => {
    setForm((prev) => ({
      ...prev,
      jurusan: prev.jurusan.includes(j) ? prev.jurusan.filter((x) => x !== j) : [...prev.jurusan, j],
    }));
  };

  const handleSubmit = () => {
    if (!form.nama.trim() || form.jurusan.length === 0) return;

    const data: MapelFormData = {
      ...form,
      id: form.kode.toLowerCase(),
    };

    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{mode === "add" ? "Tambah Mata Pelajaran" : "Edit Mata Pelajaran"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nama */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Mata Pelajaran</label>
            <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Pemrograman Web" />
          </div>

          {/* KODE */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Kode Mapel</label>
            <Input value={form.kode} readOnly className="bg-gray-100" />
          </div>

          {/* KATEGORI */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Kategori</label>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={form.kategori}
              onChange={(e) =>
                setForm({
                  ...form,
                  kategori: e.target.value as "Umum" | "C1" | "C2" | "C3",
                })
              }
            >
              <option value="Umum">Umum</option>
              <option value="C1">C1 (Dasar Program Keahlian)</option>
              <option value="C2">C2 (Kompetensi Keahlian)</option>
              <option value="C3">C3 (Paket Keahlian)</option>
            </select>
          </div>

          {/* TINGKAT */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tingkat</label>
            <select
              className="border px-3 py-2 rounded-md w-full"
              value={form.tingkat}
              onChange={(e) =>
                setForm({
                  ...form,
                  tingkat: e.target.value as "X" | "XI" | "XII",
                })
              }
            >
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>
          </div>

          {/* JURUSAN MULTI SELECT */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Jurusan</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {form.jurusan.length > 0 ? form.jurusan.join(", ") : "Pilih Jurusan (multi select)"}
                  <ChevronsUpDown className="w-4 h-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari jurusan..." />
                  <CommandList>
                    <CommandEmpty>Tidak ditemukan</CommandEmpty>
                    <CommandGroup>
                      {jurusanList.map((j) => (
                        <CommandItem key={j} onSelect={() => toggleJurusan(j)}>
                          <Check className={cn("mr-2 h-4 w-4", form.jurusan.includes(j) ? "opacity-100" : "opacity-0")} />
                          {j}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* JP */}
          <div className="space-y-1">
            <label className="text-sm font-medium">JP / Minggu</label>
            <Input type="number" value={form.jp} onChange={(e) => setForm({ ...form, jp: Number(e.target.value) })} placeholder="6" />
          </div>

          {/* STATUS */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "Aktif" | "Tidak Aktif",
                })
              }
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button className="bg-sky-600 text-white hover:bg-sky-700" onClick={handleSubmit}>
            {mode === "add" ? "Tambah" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
