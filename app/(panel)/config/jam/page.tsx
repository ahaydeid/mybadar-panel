"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JamModal, { JamFormData } from "@/app/(panel)/config/components/JamModal";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

type Jam = {
  id: string;
  nama: string; // contoh: J-1
  jamMulai: string;
  jamSelesai: string;
  status: "Aktif" | "Tidak Aktif";
};

// Dummy data
const dummyJam: Jam[] = [
  { id: "1", nama: "J-1", jamMulai: "07:00", jamSelesai: "07:45", status: "Aktif" },
  { id: "2", nama: "J-2", jamMulai: "07:45", jamSelesai: "08:30", status: "Aktif" },
  { id: "3", nama: "J-3", jamMulai: "08:30", jamSelesai: "09:15", status: "Aktif" },
  { id: "4", nama: "J-4", jamMulai: "09:15", jamSelesai: "10:00", status: "Aktif" },
  { id: "5", nama: "J-5", jamMulai: "10:15", jamSelesai: "11:00", status: "Aktif" },
  { id: "6", nama: "J-6", jamMulai: "11:00", jamSelesai: "11:45", status: "Tidak Aktif" },
];

export default function ConfigJamPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [jamData, setJamData] = React.useState<Jam[]>(dummyJam);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selectedData, setSelectedData] = React.useState<JamFormData | undefined>(undefined);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const filtered = jamData.filter((j) => `${j.nama} ${j.jamMulai} ${j.jamSelesai}`.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedData(undefined);
    setModalOpen(true);
  };

  const openEditModal = (jam: Jam) => {
    setModalMode("edit");
    setSelectedData(jam);
    setModalOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Konfigurasi Jam Pelajaran</h1>

        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Cari jam..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />

          <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white" onClick={openAddModal}>
            <Plus className="w-4 h-4" /> Tambah Jam
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded border border-gray-200 shadow-sm bg-white">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-sky-100 text-gray-700">
            <tr>
              <th className="p-3 w-12 text-center">No.</th>
              <th className="p-3 w-20">Nama</th>
              <th className="p-3">Jam Mulai</th>
              <th className="p-3">Jam Selesai</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {paginated.map((j, i) => (
              <tr key={j.id} className="border-b hover:bg-sky-50">
                <td className="p-3 text-center">{(page - 1) * rowsPerPage + i + 1}</td>
                <td className="p-3 font-medium">{j.nama}</td>
                <td className="p-3">{j.jamMulai}</td>
                <td className="p-3">{j.jamSelesai}</td>
                <td className={`p-3 ${j.status === "Aktif" ? "text-emerald-600" : "text-rose-600"}`}>{j.status}</td>

                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs flex items-center gap-1" onClick={() => openEditModal(j)}>
                      <Pencil className="w-4 h-4" /> Edit
                    </button>

                    <button className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded text-xs flex items-center gap-1">
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <span className="text-sm text-gray-600">
          {page} dari {totalPages || 1}
        </span>

        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* MODAL */}
      <JamModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedData}
        existingCount={jamData.length}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          if (modalMode === "add") {
            setJamData([...jamData, data]);
          } else {
            setJamData(jamData.map((j) => (j.id === data.id ? data : j)));
          }
          setModalOpen(false);
        }}
      />
    </div>
  );
}
