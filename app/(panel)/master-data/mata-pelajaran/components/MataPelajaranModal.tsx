"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface MapelFormData {
  id: number | null;
  kode: string;
  nama: string;
  kategori: "NORMATIF" | "ADAPTIF" | "PRODUKTIF" | "MUATAN_LOKAL" | "LAINNYA";
  tingkat: "X" | "XI" | "XII";
  jp: number;
  status: "Aktif" | "Tidak Aktif";
}

interface Props {
  open: boolean;
  mode: "add" | "edit";
  initialData?: MapelFormData;
  onClose: () => void;
  onSubmit: (data: MapelFormData) => void;
}

export default function MataPelajaranModal({ open, mode, initialData, onClose, onSubmit }: Props) {
  const [errorNama, setErrorNama] = React.useState("");
  const [errorKode, setErrorKode] = React.useState("");

  const [form, setForm] = React.useState<MapelFormData>({
    id: null,
    kode: "",
    nama: "",
    kategori: "NORMATIF",
    tingkat: "X",
    jp: 2,
    status: "Aktif",
  });

  React.useEffect(() => {
    if (open && mode === "edit" && initialData) {
      setForm(initialData);
      return;
    }

    if (open && mode === "add") {
      setForm({
        id: null,
        kode: "",
        nama: "",
        kategori: "NORMATIF",
        tingkat: "X",
        jp: 2,
        status: "Aktif",
      });
    }
  }, [open, mode, initialData]);

  const handleSubmit = () => {
    let valid = true;
    if (!form.nama.trim()) {
      setErrorNama("Nama wajib diisi");
      valid = false;
    } else {
      setErrorNama("");
    }
    if (!form.kode.trim()) {
      setErrorKode("Kode mapel wajib diisi");
      valid = false;
    } else {
      setErrorKode("");
    }
    if (!valid) return;
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Mata Pelajaran" : "Edit Mata Pelajaran"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nama</label>
            <Input
              value={form.nama}
              onChange={(e) => {
                setForm({ ...form, nama: e.target.value });
                if (e.target.value.trim()) setErrorNama("");
              }}
              className={errorNama ? "border-red-500" : ""}
            />
            {errorNama && <p className="text-red-500 text-xs mt-1">{errorNama}</p>}
          </div>

          <div>
            <label className="text-sm font-medium">Kode Mapel</label>
            <Input
              value={form.kode}
              onChange={(e) => {
                setForm({ ...form, kode: e.target.value });
                if (e.target.value.trim()) setErrorKode("");
              }}
              className={errorKode ? "border-red-500" : ""}
            />
            {errorKode && <p className="text-red-500 text-xs mt-1">{errorKode}</p>}
          </div>

          <div>
            <label>Kategori</label>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={form.kategori}
              onChange={(e) =>
                setForm({
                  ...form,
                  kategori: e.target.value as MapelFormData["kategori"],
                })
              }
            >
              <option value="NORMATIF">Normatif</option>
              <option value="ADAPTIF">Adaptif</option>
              <option value="PRODUKTIF">Produktif</option>
              <option value="MUATAN_LOKAL">Muatan Lokal</option>
              <option value="LAINNYA">Lainnya</option>
            </select>
          </div>

          <div>
            <label>Tingkat</label>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={form.tingkat}
              onChange={(e) =>
                setForm({
                  ...form,
                  tingkat: e.target.value as MapelFormData["tingkat"],
                })
              }
            >
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>
          </div>

          <div>
            <label>JP / Minggu</label>
            <Input type="number" value={form.jp} onChange={(e) => setForm({ ...form, jp: Number(e.target.value) })} />
          </div>

          <div>
            <label>Status</label>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as MapelFormData["status"],
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
          <Button className="bg-sky-600 text-white" onClick={handleSubmit}>
            {mode === "add" ? "Tambah" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
