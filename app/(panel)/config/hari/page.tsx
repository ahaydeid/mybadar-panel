"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HariModal, { HariFormData } from "@/app/(panel)/config/components/HariModal";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Hari = {
  id: number;
  namaHari: string;
  status: "Aktif" | "Tidak Aktif";
};

export default function ConfigHariPage() {
  const supabase = createClientComponentClient();

  const [hariData, setHariData] = React.useState<Hari[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selectedHari, setSelectedHari] = React.useState<HariFormData | undefined>(undefined);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  // =====================================================
  // LOAD DATA FROM DB
  // =====================================================
  const loadHari = React.useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase.from("hari").select("id, nama").order("id", { ascending: true });

    if (error) {
      console.error("Error load hari:", error);
      setLoading(false);
      return;
    }

    const mapped: Hari[] = (data ?? []).map((item) => ({
      id: item.id,
      namaHari: item.nama,
      status: "Aktif", // kalau nanti ada field status tinggal ganti
    }));

    setHariData(mapped);
    setLoading(false);
  }, [supabase]);

  React.useEffect(() => {
    loadHari();
  }, [loadHari]);

  // =====================================================
  // FILTER + PAGINATION
  // =====================================================
  const filtered = hariData.filter((h) => h.namaHari.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  // =====================================================
  // OPEN MODAL HANDLERS
  // =====================================================
  const openAddModal = () => {
    setModalMode("add");
    setSelectedHari(undefined);
    setModalOpen(true);
  };

  const openEditModal = (hari: Hari) => {
    setModalMode("edit");
    setSelectedHari({
      id: hari.id,
      namaHari: hari.namaHari,
      status: hari.status,
    });
    setModalOpen(true);
  };

  // =====================================================
  // DELETE
  // =====================================================
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("hari").delete().eq("id", id).select("*");

    if (error) {
      alert("Tidak bisa menghapus. Data digunakan di tabel lain.");
      console.error(error);
      return;
    }

    loadHari();
  };

  // =====================================================
  // SUBMIT
  // =====================================================
  const handleSubmit = async (data: HariFormData) => {
    if (modalMode === "add") {
      await supabase.from("hari").insert({
        nama: data.namaHari,
      });
    } else {
      await supabase
        .from("hari")
        .update({
          nama: data.namaHari,
        })
        .eq("id", data.id);
    }

    setModalOpen(false);
    loadHari();
  };

  // =====================================================
  // UI
  // =====================================================
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
              <th className="p-3 w-12 text-center">ID</th>
              <th className="p-3">Hari</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {loading && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  Memuat...
                </td>
              </tr>
            )}

            {!loading &&
              paginated.map((h, i) => (
                <tr key={h.id} className="border-b hover:bg-sky-50">
                  <td className="p-3 text-center w-12">{startIndex + i + 1}</td>
                  <td className="p-3 font-medium">{h.namaHari}</td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs flex items-center gap-1" onClick={() => openEditModal(h)}>
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded text-xs flex items-center gap-1" onClick={() => handleDelete(h.id)}>
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
      <HariModal open={modalOpen} mode={modalMode} initialData={selectedHari} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
