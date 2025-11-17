"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KelasFormData {
  id: number | null;
  namaKelas: string;
  tingkat: "X" | "XI" | "XII";
  jurusanId: number | null;
  jurusanNama: string;
  waliId: number | null;
  waliNama: string;
  jumlahSiswa: number;
  tahunAjaran: string;
  status: "ACTIVE" | "INACTIVE";
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
    id: null,
    namaKelas: "",
    tingkat: "X",
    jurusanId: null,
    jurusanNama: "",
    waliId: null,
    waliNama: "",
    jumlahSiswa: 0,
    tahunAjaran: "2024/2025",
    status: "ACTIVE",
  });

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const [jurusanList, setJurusanList] = React.useState<{ id: number; nama: string }[]>([]);
  const [guruList, setGuruList] = React.useState<{ id: number; nama: string }[]>([]);
  const [tahunList, setTahunList] = React.useState<string[]>([]);

  const loadJurusan = async () => {
    const { data } = await supabase.from("jurusan").select("id, nama").order("nama", { ascending: true });

    if (data) setJurusanList(data);
  };

  const loadGuru = async () => {
    const { data } = await supabase.from("guru").select("id, nama").order("nama", { ascending: true });

    if (data) setGuruList(data);
  };

  const loadTahunAjaran = async () => {
    const { data } = await supabase.from("semester").select("tahun_ajaran").order("tahun_ajaran", { ascending: false });

    if (data) {
      const unique = Array.from(new Set(data.map((d) => d.tahun_ajaran)));
      setTahunList(unique);
    }
  };

  React.useEffect(() => {
    if (open) {
      loadJurusan();
      loadGuru();
      loadTahunAjaran();
    }
  }, [open]);

  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: null,
        namaKelas: "",
        tingkat: "X",
        jurusanId: null,
        jurusanNama: "",
        waliId: null,
        waliNama: "",
        jumlahSiswa: 0,
        tahunAjaran: "2024/2025",
        status: "ACTIVE",
      });
    }
  }, [mode, initialData]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.namaKelas.trim()) newErrors.namaKelas = "Nama kelas wajib diisi.";
    if (!form.tingkat) newErrors.tingkat = "Tingkat wajib dipilih.";
    if (!form.jurusanId) newErrors.jurusanId = "Jurusan wajib dipilih.";
    if (!form.tahunAjaran.trim()) newErrors.tahunAjaran = "Tahun ajaran wajib dipilih.";
    if (!form.status) newErrors.status = "Status wajib dipilih.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">{mode === "add" ? "Tambah Kelas" : "Edit Kelas"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Kelas</label>
            <Input value={form.namaKelas} onChange={(e) => setForm({ ...form, namaKelas: e.target.value })} placeholder="X RPL 1" />
            {errors.namaKelas && <p className="text-red-500 text-xs">{errors.namaKelas}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Tingkat</label>
            <label className="text-sm font-medium">Tingkat</label>
            <select className="border rounded-md px-3 py-2 w-full" value={form.tingkat} onChange={(e) => setForm({ ...form, tingkat: e.target.value as "X" | "XI" | "XII" })}>
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>
            {errors.tingkat && <p className="text-red-500 text-xs">{errors.tingkat}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Jurusan</label>

            <select
              className="border rounded-md px-3 py-2 w-full"
              value={form.jurusanId ?? ""}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                const selectedNama = jurusanList.find((j) => j.id === selectedId)?.nama || "";

                setForm({
                  ...form,
                  jurusanId: selectedId,
                  jurusanNama: selectedNama,
                });
              }}
            >
              <option value="">Pilih Jurusan</option>

              {jurusanList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nama}
                </option>
              ))}
            </select>

            {errors.jurusanId && <p className="text-red-500 text-xs">{errors.jurusanId}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Wali Kelas</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {form.waliNama || "Pilih Wali Kelas"}
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
                        <CommandItem
                          key={g.id}
                          onSelect={() =>
                            setForm({
                              ...form,
                              waliId: g.id,
                              waliNama: g.nama,
                            })
                          }
                        >
                          <Check className={cn("mr-2 h-4 w-4", form.waliId === g.id ? "opacity-100" : "opacity-0")} />
                          {g.nama}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Tahun Ajaran</label>

            <select className="border rounded-md px-3 py-2 w-full" value={form.tahunAjaran} onChange={(e) => setForm({ ...form, tahunAjaran: e.target.value })}>
              <option value="">Pilih Tahun Ajaran</option>

              {tahunList.map((tahun) => (
                <option key={tahun} value={tahun}>
                  {tahun}
                </option>
              ))}
            </select>
            {errors.tahunAjaran && <p className="text-red-500 text-xs">{errors.tahunAjaran}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "ACTIVE" | "INACTIVE",
                })
              }
            >
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Tidak Aktif</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs">{errors.status}</p>}
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
