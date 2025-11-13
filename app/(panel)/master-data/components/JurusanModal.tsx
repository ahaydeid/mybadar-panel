"use client";

import * as React from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { Command, CommandInput, CommandItem, CommandGroup, CommandList, CommandEmpty } from "@/components/ui/command";

import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// =====================
// DUMMY DATA GURU
// =====================
const guruList = ["Agus Suryanto, S.Pd", "Budi Santoso, M.Pd", "Lilis Kurniawati, S.Pd", "Hendra Wijaya, S.Kom", "Mega Lestari, M.Pd", "Deni Pratama, S.T", "Ayu Kartika, S.Pd", "Rahmat Fauzi, M.Pd"];

// =====================
// DATA TYPES
// =====================

export interface JurusanFormData {
  id: string;
  nama: string;
  singkatan: string;
  kepalaProgram: string;
  deskripsi: string;
}

interface JurusanModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: JurusanFormData;
  onClose: () => void;
  onSubmit: (data: JurusanFormData) => void;
}

// =====================
// MODAL COMPONENT
// =====================

export default function JurusanModal({ open, mode, initialData, onClose, onSubmit }: JurusanModalProps): React.ReactElement {
  const [form, setForm] = React.useState<JurusanFormData>({
    id: "",
    nama: "",
    singkatan: "",
    kepalaProgram: "",
    deskripsi: "",
  });

  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: "",
        nama: "",
        singkatan: "",
        kepalaProgram: "",
        deskripsi: "",
      });
    }
  }, [mode, initialData]);

  const handleSubmit = (): void => {
    if (!form.nama.trim() || !form.singkatan.trim()) return;

    const data: JurusanFormData = {
      ...form,
      id: form.singkatan.toUpperCase(),
      singkatan: form.singkatan.toUpperCase(),
    };

    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">{mode === "add" ? "Tambah Jurusan" : "Edit Jurusan"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* NAMA */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nama Jurusan</label>
            <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Teknik Kendaraan Ringan" />
          </div>

          {/* SINGKATAN */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Singkatan</label>
            <Input value={form.singkatan} onChange={(e) => setForm({ ...form, singkatan: e.target.value.toUpperCase() })} placeholder="TKR" />
          </div>

          {/* KEPALA PROGRAM - AUTOCOMPLETE */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Kepala Program</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {form.kepalaProgram ? form.kepalaProgram : "Pilih Kepala Program (opsional)"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari guru..." />
                  <CommandList>
                    <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {guruList.map((guru) => (
                        <CommandItem
                          key={guru}
                          value={guru}
                          onSelect={() => {
                            setForm({ ...form, kepalaProgram: guru });
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", guru === form.kepalaProgram ? "opacity-100" : "opacity-0")} />
                          {guru}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* DESKRIPSI */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
            <Textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi jurusan (opsional)" />
          </div>
        </div>

        <DialogFooter className="mt-4">
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
