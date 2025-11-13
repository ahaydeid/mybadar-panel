"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import JurusanModal, { JurusanFormData } from "../components/JurusanModal";

// ==========================
// Dummy Data Awal
// ==========================

const initialJurusan: JurusanFormData[] = [
  {
    id: "TKR",
    nama: "Teknik Kendaraan Ringan",
    singkatan: "TKR",
    kepalaProgram: "",
    deskripsi: "",
  },
  {
    id: "TBSM",
    nama: "Teknik Bengkel dan Sepeda Motor",
    singkatan: "TBSM",
    kepalaProgram: "",
    deskripsi: "",
  },
  {
    id: "MPLB",
    nama: "Manajemen Perkantoran dan Layanan Bisnis",
    singkatan: "MPLB",
    kepalaProgram: "",
    deskripsi: "",
  },
];

export default function MasterJurusanPage() {
  const [jurusan, setJurusan] = React.useState(initialJurusan);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selectedJurusan, setSelectedJurusan] = React.useState<JurusanFormData | undefined>();

  const handleAdd = () => {
    setModalMode("add");
    setSelectedJurusan(undefined);
    setModalOpen(true);
  };

  const handleEdit = (data: JurusanFormData) => {
    setModalMode("edit");
    setSelectedJurusan(data);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus jurusan ini?")) {
      setJurusan((prev) => prev.filter((j) => j.id !== id));
    }
  };

  const handleSubmit = (data: JurusanFormData) => {
    if (modalMode === "add") {
      setJurusan((prev) => [...prev, data]);
    } else {
      setJurusan((prev) => prev.map((j) => (j.id === selectedJurusan?.id ? data : j)));
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Master Jurusan</h1>

        <Button onClick={handleAdd} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white">
          <Plus className="w-4 h-4" />
          Tambah Jurusan
        </Button>
      </div>

      {/* TABEL */}
      <div className="rounded border border-gray-200 shadow-sm bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm text-left border-collapse">
            <thead className="bg-sky-100 text-[15px] text-gray-700 h-14">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Kode</th>
                <th className="p-3">Nama Jurusan</th>
                <th className="p-3">Kepala Program</th>
                <th className="p-3">Deskripsi</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {jurusan.map((j, index) => (
                <tr key={j.id} className="border-b last:border-none hover:bg-sky-50 transition-colors">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-semibold">{j.singkatan}</td>
                  <td className="p-3">{j.nama}</td>
                  <td className="p-3">{j.kepalaProgram || "-"}</td>
                  <td className="p-3">{j.deskripsi || "-"}</td>
                  {/* Aksi */}
                  <td className="p-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium" onClick={() => handleEdit(j)}>
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium" onClick={() => handleDelete(j.id)}>
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <JurusanModal open={modalOpen} mode={modalMode} initialData={selectedJurusan} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
