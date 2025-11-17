"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import HariModal, { HariFormData } from "@/app/(panel)/config/components/HariModal";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// MODAL TAMBAHAN
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import SuccessDeleteModal from "@/app/components/SuccessDeleteModal";
import SuccessAddModal from "@/app/components/SuccessAddModal";
import SuccessSaveModal from "@/app/components/SuccessSaveModal";
import ErrorAddModal from "@/app/components/ErrorAddModal";

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

  // MODAL STATES
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [successDeleteOpen, setSuccessDeleteOpen] = React.useState(false);
  const [successAddOpen, setSuccessAddOpen] = React.useState(false);
  const [successSaveOpen, setSuccessSaveOpen] = React.useState(false);
  const [errorAddOpen, setErrorAddOpen] = React.useState(false);

  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  // =====================================================
  // LOAD DATA
  // =====================================================
  const loadHari = React.useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase.from("hari").select("id, nama, status").order("id", { ascending: true });

    if (error) {
      console.error("Error load hari:", error);
      setLoading(false);
      return;
    }

    const mapped: Hari[] =
      (data ?? []).map((item) => ({
        id: item.id,
        namaHari: item.nama,
        status: item.status ? "Aktif" : "Tidak Aktif",
      })) ?? [];

    setHariData(mapped);
    setLoading(false);
  }, [supabase]);

  React.useEffect(() => {
    loadHari();
  }, [loadHari]);

  // FILTER
  const filtered = hariData.filter((h) => h.namaHari.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  // =====================================================
  // OPEN MODAL
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
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDeleteAction = async () => {
    if (deleteId === null) return;

    const { error } = await supabase.from("hari").delete().eq("id", deleteId).select("*");

    setConfirmDeleteOpen(false);

    if (error) {
      setErrorAddOpen(true);
      return;
    }

    setSuccessDeleteOpen(true);
    loadHari();
  };

  // =====================================================
  // SUBMIT
  // =====================================================
  const handleSubmit = async (data: HariFormData) => {
    let errorOccurred = false;

    if (modalMode === "add") {
      const { error } = await supabase.from("hari").insert({
        nama: data.namaHari,
        status: data.status === "Aktif",
      });

      if (error) {
        errorOccurred = true;
      } else {
        setSuccessAddOpen(true);
      }
    } else {
      const { error } = await supabase
        .from("hari")
        .update({
          nama: data.namaHari,
          status: data.status === "Aktif",
        })
        .eq("id", data.id);

      if (error) {
        errorOccurred = true;
      } else {
        setSuccessSaveOpen(true);
      }
    }

    setModalOpen(false);

    if (errorOccurred) {
      setErrorAddOpen(true);
      return;
    }

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
              <th className="p-3 w-32 text-center">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {loading && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  Memuat...
                </td>
              </tr>
            )}

            {!loading &&
              paginated.map((h, i) => (
                <tr key={h.id} className="border-b hover:bg-sky-50">
                  <td className="p-3 text-center w-12">{startIndex + i + 1}</td>

                  <td className="p-3 font-medium">{h.namaHari}</td>

                  <td className="p-3 text-center">{h.status}</td>

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

      {/* MODALS */}
      <HariModal open={modalOpen} mode={modalMode} initialData={selectedHari} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />

      <ConfirmDeleteModal open={confirmDeleteOpen} onCancel={() => setConfirmDeleteOpen(false)} onConfirm={confirmDeleteAction} />

      <SuccessDeleteModal open={successDeleteOpen} onClose={() => setSuccessDeleteOpen(false)} />

      <SuccessAddModal open={successAddOpen} onClose={() => setSuccessAddOpen(false)} />

      <SuccessSaveModal open={successSaveOpen} onClose={() => setSuccessSaveOpen(false)} />

      <ErrorAddModal open={errorAddOpen} onClose={() => setErrorAddOpen(false)} />
    </div>
  );
}
