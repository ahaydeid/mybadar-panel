"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase/client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandGroup, CommandList, CommandEmpty } from "@/components/ui/command";

import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// =====================
// DATA TYPES (REAL)
// =====================

export interface JurusanFormData {
  id?: number;
  kode: string;
  nama: string;
  singkatan?: string;

  kepalaProgram?: string | null; // NAMA guru
  kepalaProgramId?: number | null; // ID guru (FK)

  deskripsi: string;
}

interface JurusanModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: JurusanFormData;
  onClose: () => void;
  onSubmit: (data: JurusanFormData) => void;
}

// ==========================
// MODAL
// ==========================

export default function JurusanModal({ open, mode, initialData, onClose, onSubmit }: JurusanModalProps): React.ReactElement {
  const [form, setForm] = React.useState<JurusanFormData>({
    kode: "",
    nama: "",
    singkatan: "",
    kepalaProgram: "",
    kepalaProgramId: null,
    deskripsi: "",
  });

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const [guruList, setGuruList] = React.useState<{ id: number; nama: string }[]>([]);
  const [loadingGuru, setLoadingGuru] = React.useState<boolean>(false);

  // ======================================================
  // LOAD GURU REAL (id + nama)
  // ======================================================
  const loadGuru = async () => {
    setLoadingGuru(true);

    const { data, error } = await supabase.from("guru").select("id, nama").order("nama");

    if (!error && data) {
      setGuruList(data);
    }

    setLoadingGuru(false);
  };

  React.useEffect(() => {
    loadGuru();
  }, []);

  // ======================================================
  // INITIAL DATA (EDIT MODE)
  // ======================================================
  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        id: initialData.id,
        kode: initialData.kode,
        nama: initialData.nama,
        singkatan: initialData.kode, // UI saja
        kepalaProgram: initialData.kepalaProgram ?? "",
        kepalaProgramId: initialData.kepalaProgramId ?? null,
        deskripsi: initialData.deskripsi ?? "",
      });
    } else {
      setForm({
        kode: "",
        nama: "",
        singkatan: "",
        kepalaProgram: "",
        kepalaProgramId: null,
        deskripsi: "",
      });
    }
  }, [mode, initialData]);

  // ======================================================
  // SUBMIT
  // ======================================================

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.nama.trim()) newErrors.nama = "Nama jurusan wajib diisi.";
    if (!form.singkatan || !form.singkatan.trim()) newErrors.singkatan = "Kode jurusan wajib diisi.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (!validate()) return;

    const data: JurusanFormData = {
      id: form.id,
      kode: (form.singkatan ?? "").toUpperCase(),
      nama: form.nama.trim(),
      singkatan: (form.singkatan ?? "").toUpperCase(),
      kepalaProgram: form.kepalaProgram ?? null,
      kepalaProgramId: form.kepalaProgramId ?? null,
      deskripsi: form.deskripsi.trim(),
    };

    onSubmit(data);
  };

  // ======================================================
  // UI (tidak diubah)
  // ======================================================
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">{mode === "add" ? "Tambah Jurusan" : "Edit Jurusan"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* NAMA */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Jurusan</label>
            <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
            {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
          </div>

          {/* SINGKATAN */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Kode Jurusan</label>
            <Input value={form.singkatan} onChange={(e) => setForm({ ...form, singkatan: e.target.value.toUpperCase() })} />
            {errors.singkatan && <p className="text-red-500 text-xs mt-1">{errors.singkatan}</p>}
          </div>

          {/* KEPALA PROGRAM */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Kepala Program</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {form.kepalaProgram || "Pilih Kepala Program (opsional)"}
                  <ChevronsUpDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari guru..." />

                  <CommandList>
                    <CommandEmpty>{loadingGuru ? "Memuat..." : "Tidak ditemukan"}</CommandEmpty>

                    <CommandGroup>
                      {guruList.map((guru) => (
                        <CommandItem
                          key={guru.id}
                          onSelect={() =>
                            setForm({
                              ...form,
                              kepalaProgram: guru.nama, // untuk UI
                              kepalaProgramId: guru.id, // untuk DB
                            })
                          }
                        >
                          <Check className={cn("mr-2 h-4 w-4", guru.id === form.kepalaProgramId ? "opacity-100" : "opacity-0")} />
                          {guru.nama}
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
            <label className="text-sm font-medium">Deskripsi</label>
            <Textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>

          <Button onClick={handleSubmit} className="bg-sky-600 text-white">
            {mode === "add" ? "Tambah" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
