"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface JamFormData {
  id: number | null;
  nama: string;
  jamMulai: string;
  jamSelesai: string;
  status: "Aktif" | "Tidak Aktif";
}

interface JamModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: JamFormData;
  existingCount?: number;
  onClose: () => void;
  onSubmit: (data: JamFormData) => void;
}

export default function JamModal({ open, mode, initialData, existingCount = 0, onClose, onSubmit }: JamModalProps) {
  const [form, setForm] = React.useState<JamFormData>({
    id: null,
    nama: "",
    jamMulai: "",
    jamSelesai: "",
    status: "Aktif",
  });

  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  // SYNC DATA EDIT / RESET ADD
  React.useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: null,
        nama: `J-${existingCount + 1}`,
        jamMulai: "",
        jamSelesai: "",
        status: "Aktif",
      });
    }

    setErrors({});
  }, [open, mode, initialData, existingCount]);

  // VALIDASI WAJIB
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.nama.trim()) newErrors.nama = "Nama jam wajib diisi.";
    if (!form.jamMulai) newErrors.jamMulai = "Jam mulai wajib diisi.";
    if (!form.jamSelesai) newErrors.jamSelesai = "Jam selesai wajib diisi.";
    if (!form.status) newErrors.status = "Status wajib dipilih.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload: JamFormData = {
      ...form,
    };

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Jam Pelajaran" : "Edit Jam Pelajaran"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* NAMA JAM */}
          <div>
            <label className="text-sm font-medium">Nama Jam</label>
            <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="J-1" />
            {errors.nama && <p className="text-red-500 text-xs">{errors.nama}</p>}
          </div>

          {/* JAM MULAI */}
          <div>
            <label className="text-sm font-medium">Jam Mulai</label>
            <Input type="time" value={form.jamMulai} onChange={(e) => setForm({ ...form, jamMulai: e.target.value })} />
            {errors.jamMulai && <p className="text-red-500 text-xs">{errors.jamMulai}</p>}
          </div>

          {/* JAM SELESAI */}
          <div>
            <label className="text-sm font-medium">Jam Selesai</label>
            <Input type="time" value={form.jamSelesai} onChange={(e) => setForm({ ...form, jamSelesai: e.target.value })} />
            {errors.jamSelesai && <p className="text-red-500 text-xs">{errors.jamSelesai}</p>}
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
