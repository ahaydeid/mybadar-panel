"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const jurusanList = ["Rekayasa Perangkat Lunak", "Teknik Komputer dan Jaringan", "Multimedia", "Akuntansi dan Keuangan Lembaga"];
const guruList = ["Budi Santoso", "Siti Aisyah", "Ahmad Fauzan", "Rina Kusuma", "Bayu Setiawan", "Lilis Kurniawati"];

export interface KelasFormData {
  id: string;
  namaKelas: string;
  tingkat: "X" | "XI" | "XII";
  jurusan: string;
  waliKelas: string;
  jumlahSiswa: number;
  tahunAjaran: string;
  status: "Aktif" | "Tidak Aktif";
}

interface KelasModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: KelasFormData;
  onClose: () => void;
  onSubmit: (data: KelasFormData) => void;
}

export default function KelasModal({ open, mode, initialData, onClose, onSubmit }: KelasModalProps): React.ReactElement {
  const [form, setForm] = React.useState<KelasFormData>({
    id: "",
    namaKelas: "",
    tingkat: "X",
    jurusan: "",
    waliKelas: "",
    jumlahSiswa: 0,
    tahunAjaran: "2024/2025",
    status: "Aktif",
  });

  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: "",
        namaKelas: "",
        tingkat: "X",
        jurusan: "",
        waliKelas: "",
        jumlahSiswa: 0,
        tahunAjaran: "2024/2025",
        status: "Aktif",
      });
    }
  }, [mode, initialData]);

  const handleSubmit = () => {
    if (!form.namaKelas.trim()) return;

    onSubmit({
      ...form,
      id: form.namaKelas.replace(/\s+/g, "-").toLowerCase(),
      jumlahSiswa: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">{mode === "add" ? "Tambah Kelas" : "Edit Kelas"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nama Kelas */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Kelas</label>
            <Input value={form.namaKelas} onChange={(e) => setForm({ ...form, namaKelas: e.target.value })} placeholder="X RPL 1" />
          </div>

          {/* Tingkat */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tingkat</label>
            <select
              className="border rounded-md px-3 py-2 w-full"
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

          {/* Jurusan */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Jurusan</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {form.jurusan || "Pilih Jurusan"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari jurusan..." />
                  <CommandList>
                    <CommandEmpty>Tidak ditemukan</CommandEmpty>
                    <CommandGroup>
                      {jurusanList.map((j) => (
                        <CommandItem key={j} onSelect={() => setForm({ ...form, jurusan: j })}>
                          <Check className={cn("mr-2 h-4 w-4", form.jurusan === j ? "opacity-100" : "opacity-0")} />
                          {j}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Wali Kelas */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Wali Kelas</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {form.waliKelas || "Pilih Wali Kelas"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari guru..." />
                  <CommandList>
                    <CommandEmpty>Tidak ditemukan</CommandEmpty>
                    <CommandGroup>
                      {guruList.map((g) => (
                        <CommandItem key={g} onSelect={() => setForm({ ...form, waliKelas: g })}>
                          <Check className={cn("mr-2 h-4 w-4", form.waliKelas === g ? "opacity-100" : "opacity-0")} />
                          {g}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Tahun Ajaran */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Tahun Ajaran</label>
            <select className="border rounded-md px-3 py-2 w-full" value={form.tahunAjaran} onChange={(e) => setForm({ ...form, tahunAjaran: e.target.value })}>
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select className="border rounded-md px-3 py-2 w-full" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "Aktif" | "Tidak Aktif" })}>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>

        <DialogFooter className="mt-4">
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
