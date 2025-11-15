"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export type MapelFormData = {
  id?: number;
  kode: string;
  nama: string;
  kategori: "NORMATIF" | "ADAPTIF" | "PRODUKTIF" | "MUATAN_LOKAL" | "LAINNYA";
  tingkat: "X" | "XI" | "XII";
  jp: number;
  warna: string; // hex color
  status: "Aktif" | "Tidak Aktif";
};

interface Props {
  open: boolean;
  mode: "add" | "edit";
  initialData?: MapelFormData;
  onClose: () => void;
  onSubmit: (data: MapelFormData) => void;
}

export default function MataPelajaranModal({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = React.useState<MapelFormData>({
    id: initialData?.id,
    kode: initialData?.kode ?? "",
    nama: initialData?.nama ?? "",
    kategori: initialData?.kategori ?? "NORMATIF",
    tingkat: initialData?.tingkat ?? "X",
    jp: initialData?.jp ?? 1,
    warna: initialData?.warna ?? "#2196F3",
    status: initialData?.status ?? "Aktif",
  });

  React.useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: undefined,
        kode: "",
        nama: "",
        kategori: "NORMATIF",
        tingkat: "X",
        jp: 1,
        warna: "#2196F3",
        status: "Aktif",
      });
    }
  }, [initialData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {mode === "add" ? "Tambah Mapel" : "Edit Mapel"}
        </h2>

        <div className="space-y-4">
          {/* KODE */}
          <div>
            <label className="text-sm font-semibold">Kode Mapel</label>
            <Input
              value={form.kode}
              onChange={(e) =>
                setForm({ ...form, kode: e.target.value.trim() })
              }
            />
          </div>

          {/* NAMA */}
          <div>
            <label className="text-sm font-semibold">Nama Mapel</label>
            <Input
              value={form.nama}
              onChange={(e) =>
                setForm({ ...form, nama: e.target.value })
              }
            />
          </div>

          {/* KATEGORI */}
          <div>
            <label className="text-sm font-semibold">Kategori</label>
            <select
              value={form.kategori}
              onChange={(e) =>
                setForm({
                  ...form,
                  kategori: e.target.value as MapelFormData["kategori"],
                })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="NORMATIF">NORMATIF</option>
              <option value="ADAPTIF">ADAPTIF</option>
              <option value="PRODUKTIF">PRODUKTIF</option>
              <option value="MUATAN_LOKAL">MUATAN LOKAL</option>
              <option value="LAINNYA">LAINNYA</option>
            </select>
          </div>

          {/* TINGKAT */}
          <div>
            <label className="text-sm font-semibold">Tingkat</label>
            <select
              value={form.tingkat}
              onChange={(e) =>
                setForm({
                  ...form,
                  tingkat: e.target.value as MapelFormData["tingkat"],
                })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="X">X</option>
              <option value="XI">XI</option>
              <option value="XII">XII</option>
            </select>
          </div>

          {/* JP */}
          <div>
            <label className="text-sm font-semibold">JP per Minggu</label>
            <Input
              type="number"
              min={1}
              value={form.jp}
              onChange={(e) =>
                setForm({ ...form, jp: Number(e.target.value) })
              }
            />
          </div>

          {/* 🎨 MODERN COLOR PICKER */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Warna Mapel</label>

            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full flex items-center justify-between px-3 py-2 border rounded bg-white">
                  <span className="font-medium">{form.warna}</span>
                  <span
                    className="w-5 h-5 rounded border"
                    style={{ background: form.warna }}
                  ></span>
                </button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-3">
                <input
                  type="color"
                  value={form.warna}
                  onChange={(e) =>
                    setForm({ ...form, warna: e.target.value })
                  }
                  className="w-20 h-12 rounded cursor-pointer"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm font-semibold">Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as MapelFormData["status"],
                })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end mt-6 gap-3">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>

          <Button
            className="bg-sky-600 text-white"
            onClick={() => onSubmit(form)}
          >
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
