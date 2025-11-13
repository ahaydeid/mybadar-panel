"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export interface HariFormData {
  id: string;
  namaHari: string;
  urutan: number;
  status: "Aktif" | "Tidak Aktif";
}

interface HariModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: HariFormData;
  onClose: () => void;
  onSubmit: (data: HariFormData) => void;
}

export default function HariModal({ open, mode, initialData, onClose, onSubmit }: HariModalProps) {
  const [form, setForm] = React.useState<HariFormData>({
    id: "",
    namaHari: "",
    urutan: 1,
    status: "Aktif",
  });

  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: "",
        namaHari: "",
        urutan: 1,
        status: "Aktif",
      });
    }
  }, [mode, initialData]);

  const handleSubmit = () => {
    if (!form.namaHari.trim()) return;

    const data: HariFormData = {
      ...form,
      id: form.namaHari.toLowerCase(),
    };

    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Hari" : "Edit Hari"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nama Hari */}
          <div>
            <label className="text-sm font-medium">Nama Hari</label>
            <Input placeholder="Contoh: Senin" value={form.namaHari} onChange={(e) => setForm({ ...form, namaHari: e.target.value })} />
          </div>

          {/* Urutan Hari */}
          <div>
            <label className="text-sm font-medium">Urutan Hari (1–7)</label>
            <Input type="number" min={1} max={7} placeholder="Contoh: 1" value={form.urutan} onChange={(e) => setForm({ ...form, urutan: Number(e.target.value) })} />
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
