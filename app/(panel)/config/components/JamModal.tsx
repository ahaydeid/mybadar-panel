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

  // SYNC EDIT / RESET ADD
  React.useEffect(() => {
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
  }, [mode, initialData, existingCount]);

  const handleSubmit = () => {
    if (!form.nama || !form.jamMulai || !form.jamSelesai) return;

    const payload: JamFormData = {
      ...form, // id = null ketika add, angka ketika edit
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
          </div>

          {/* JAM MULAI */}
          <div>
            <label className="text-sm font-medium">Jam Mulai</label>
            <Input type="time" value={form.jamMulai} onChange={(e) => setForm({ ...form, jamMulai: e.target.value })} />
          </div>

          {/* JAM SELESAI */}
          <div>
            <label className="text-sm font-medium">Jam Selesai</label>
            <Input type="time" value={form.jamSelesai} onChange={(e) => setForm({ ...form, jamSelesai: e.target.value })} />
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
