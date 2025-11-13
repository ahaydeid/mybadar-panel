"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface JamFormData {
  id: string;
  nama: string; // contoh: J-1
  jamMulai: string;
  jamSelesai: string;
  status: "Aktif" | "Tidak Aktif";
}

interface JamModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: JamFormData;
  existingCount?: number; // jumlah jam eksisting → untuk auto generate
  onClose: () => void;
  onSubmit: (data: JamFormData) => void;
}

export default function JamModal({ open, mode, initialData, existingCount = 0, onClose, onSubmit }: JamModalProps) {
  const [form, setForm] = React.useState<JamFormData>({
    id: "",
    nama: "",
    jamMulai: "",
    jamSelesai: "",
    status: "Aktif",
  });

  // Sync data edit / reset add
  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: "",
        nama: `J-${existingCount + 1}`, // AUTO: J-1, J-2, dst
        jamMulai: "",
        jamSelesai: "",
        status: "Aktif",
      });
    }
  }, [mode, initialData, existingCount]);

  const handleSubmit = () => {
    if (!form.nama || !form.jamMulai || !form.jamSelesai) return;

    const data: JamFormData = {
      ...form,
      id: form.id || crypto.randomUUID(),
    };

    onSubmit(data);
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
          <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={handleSubmit}>
            {mode === "add" ? "Tambah" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
