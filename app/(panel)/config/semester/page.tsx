"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SemesterModal, { SemesterFormData } from "@/app/(panel)/config/components/SemesterModal";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

type Semester = {
  id: string;
  namaSemester: string;
  tahunAjaran: string;
  jenis: "Ganjil" | "Genap";
  status: "Aktif" | "Tidak Aktif";
};

// Dummy data
const dummySemester: Semester[] = [
  { id: "2024-ganjil", namaSemester: "Semester Ganjil", tahunAjaran: "2024/2025", jenis: "Ganjil", status: "Aktif" },
  { id: "2024-genap", namaSemester: "Semester Genap", tahunAjaran: "2024/2025", jenis: "Genap", status: "Tidak Aktif" },
];

export default function ConfigSemesterPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dataSemester, setDataSemester] = React.useState<Semester[]>(dummySemester);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selected, setSelected] = React.useState<SemesterFormData | undefined>(undefined);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const filtered = dataSemester.filter((d) => `${d.namaSemester} ${d.tahunAjaran}`.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const openAddModal = () => {
    setSelected(undefined);
    setModalMode("add");
    setModalOpen(true);
  };

  const openEditModal = (item: Semester) => {
    setSelected(item);
    setModalMode("edit");
    setModalOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Konfigurasi Semester</h1>

        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Cari semester..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />

          <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white" onClick={openAddModal}>
            <Plus className="w-4 h-4" /> Tambah Semester
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded border border-gray-200 shadow-sm bg-white">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-sky-100 text-gray-700">
            <tr>
              <th className="p-3 w-16 text-center">No</th>
              <th className="p-3">Nama Semester</th>
              <th className="p-3">Tahun Ajaran</th>
              <th className="p-3">Jenis</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {paginated.map((s, index) => (
              <tr key={s.id} className="border-b hover:bg-sky-50">
                <td className="p-3 text-center">{(page - 1) * rowsPerPage + index + 1}</td>
                <td className="p-3 font-medium">{s.namaSemester}</td>
                <td className="p-3">{s.tahunAjaran}</td>
                <td className="p-3">{s.jenis}</td>
                <td className={`p-3 ${s.status === "Aktif" ? "text-emerald-600" : "text-rose-600"}`}>{s.status}</td>

                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs flex items-center gap-1" onClick={() => openEditModal(s)}>
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
        <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage(page - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <span className="text-sm text-gray-600">
          {page} dari {totalPages || 1}
        </span>

        <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* MODAL */}
      <SemesterModal
        open={modalOpen}
        mode={modalMode}
        initialData={selected}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          if (modalMode === "add") setDataSemester([...dataSemester, data]);
          else setDataSemester(dataSemester.map((s) => (s.id === data.id ? data : s)));

          setModalOpen(false);
        }}
      />
    </div>
  );
}
