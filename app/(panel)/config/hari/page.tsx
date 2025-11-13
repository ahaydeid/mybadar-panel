"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HariModal, { HariFormData } from "@/app/(panel)/config/components/HariModal";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

type Hari = {
  id: string;
  namaHari: string;
  urutan: number;
  status: "Aktif" | "Tidak Aktif";
};

const dummyHari: Hari[] = [
  { id: "senin", namaHari: "Senin", urutan: 1, status: "Aktif" },
  { id: "selasa", namaHari: "Selasa", urutan: 2, status: "Aktif" },
  { id: "rabu", namaHari: "Rabu", urutan: 3, status: "Aktif" },
  { id: "kamis", namaHari: "Kamis", urutan: 4, status: "Aktif" },
  { id: "jumat", namaHari: "Jumat", urutan: 5, status: "Aktif" },
  { id: "sabtu", namaHari: "Sabtu", urutan: 6, status: "Tidak Aktif" },
  { id: "minggu", namaHari: "Minggu", urutan: 7, status: "Tidak Aktif" },
];

export default function ConfigHariPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [hariData, setHariData] = React.useState<Hari[]>(dummyHari);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selectedHari, setSelectedHari] = React.useState<HariFormData | undefined>(undefined);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const filtered = hariData.filter((h) => h.namaHari.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedHari(undefined);
    setModalOpen(true);
  };

  const openEditModal = (hari: Hari) => {
    setModalMode("edit");
    setSelectedHari(hari);
    setModalOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Konfigurasi Hari</h1>

        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Cari hari..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />

          <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white" onClick={openAddModal}>
            <Plus className="w-4 h-4" />
            Tambah Hari
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm min-w-[650px]">
          <thead className="bg-sky-100 text-gray-700">
            <tr>
              <th className="p-3 w-12 text-center">No.</th>
              <th className="p-3">Hari</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {paginated.map((h) => (
              <tr key={h.id} className="border-b hover:bg-sky-50">
                <td className="p-3 text-center w-12">{h.urutan}</td>
                <td className="p-3 font-medium">{h.namaHari}</td>
                <td className={`p-3 ${h.status === "Aktif" ? "text-emerald-600" : "text-rose-600"}`}>{h.status}</td>

                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs flex items-center gap-1" onClick={() => openEditModal(h)}>
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>

                    <button className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded text-xs flex items-center gap-1">
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

      {/* PAGINATION */}
      <div className="flex justify-end gap-3">
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
      <HariModal
        open={modalOpen}
        mode={modalMode}
        initialData={selectedHari}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          if (modalMode === "add") {
            setHariData([...hariData, data]);
          } else {
            setHariData(hariData.map((h) => (h.id === data.id ? data : h)));
          }
          setModalOpen(false);
        }}
      />
    </div>
  );
}
