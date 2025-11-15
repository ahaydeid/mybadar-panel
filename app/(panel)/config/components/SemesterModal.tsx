"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export interface SemesterFormData {
  id: number | null;
  namaSemester: string;
  tahunAjaran: string;
  jenis: "Ganjil" | "Genap";
  status: "Aktif" | "Tidak Aktif";
}

interface Props {
  open: boolean;
  mode: "add" | "edit";
  initialData?: SemesterFormData;
  onClose: () => void;
  onSubmit: (data: SemesterFormData) => void;
}

export default function SemesterModal({ open, mode, initialData, onClose, onSubmit }: Props) {
  const [form, setForm] = React.useState<SemesterFormData>({
    id: null,
    namaSemester: "",
    tahunAjaran: "",
    jenis: "Ganjil",
    status: "Aktif",
  });

  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: null,
        namaSemester: "",
        tahunAjaran: "",
        jenis: "Ganjil",
        status: "Aktif",
      });
    }
  }, [mode, initialData]);

  const handleSubmit = () => {
    if (!form.namaSemester.trim() || !form.tahunAjaran.trim()) return;

    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Semester" : "Edit Semester"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nama */}
          <div>
            <label className="text-sm font-medium">Nama Semester</label>
            <Input value={form.namaSemester} onChange={(e) => setForm({ ...form, namaSemester: e.target.value })} placeholder="Semester Ganjil" />
          </div>

          {/* Tahun */}
          <div>
            <label className="text-sm font-medium">Tahun Ajaran</label>
            <Input value={form.tahunAjaran} onChange={(e) => setForm({ ...form, tahunAjaran: e.target.value })} placeholder="2024/2025" />
          </div>

          {/* Jenis */}
          <div>
            <label className="text-sm font-medium">Jenis</label>
            <Select value={form.jenis} onValueChange={(v) => setForm({ ...form, jenis: v as "Ganjil" | "Genap" })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ganjil">Ganjil</SelectItem>
                <SelectItem value="Genap">Genap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "Aktif" | "Tidak Aktif" })}>
              <SelectTrigger>
                <SelectValue />
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
