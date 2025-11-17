"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import JamModal, { JamFormData } from "@/app/(panel)/config/components/JamModal";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import SuccessDeleteModal from "@/app/components/SuccessDeleteModal";
import SuccessAddModal from "@/app/components/SuccessAddModal";
import SuccessSaveModal from "@/app/components/SuccessSaveModal";
import ErrorAddModal from "@/app/components/ErrorAddModal";

type Jam = {
  id: number;
  nama: string;
  jamMulai: string;
  jamSelesai: string;
  status: "Aktif" | "Tidak Aktif";
};

export default function ConfigJamPage() {
  const supabase = createClientComponentClient();

  const [jamData, setJamData] = React.useState<Jam[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selectedData, setSelectedData] = React.useState<JamFormData | undefined>(undefined);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = React.useState(false);
  const [addSuccessOpen, setAddSuccessOpen] = React.useState(false);
  const [saveSuccessOpen, setSaveSuccessOpen] = React.useState(false);
  const [errorAddOpen, setErrorAddOpen] = React.useState(false);

  const [rowToDelete, setRowToDelete] = React.useState<number | null>(null);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  // ===========================================
  // LOAD DATA DARI DB
  // ===========================================
  const loadJam = React.useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase.from("jam").select("id, nama, jam_mulai, jam_selesai, status").order("id", { ascending: true });

    if (error) {
      console.error("Load jam error:", error);
      setLoading(false);
      return;
    }

    const mapped: Jam[] = (data ?? []).map((item) => ({
      id: item.id,
      nama: item.nama,
      jamMulai: item.jam_mulai,
      jamSelesai: item.jam_selesai,
      status: item.status === "Tidak Aktif" ? "Tidak Aktif" : "Aktif",
    }));

    setJamData(mapped);
    setLoading(false);
  }, [supabase]);

  React.useEffect(() => {
    loadJam();
  }, [loadJam]);

  // ===========================================
  // FILTER & PAGINATION
  // ===========================================
  const filtered = jamData.filter((j) => `${j.nama} ${j.jamMulai} ${j.jamSelesai}`.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ===========================================
  // HANDLERS
  // ===========================================
  const openAddModal = () => {
    setModalMode("add");
    setSelectedData(undefined);
    setModalOpen(true);
  };

  const openEditModal = (jam: Jam) => {
    setModalMode("edit");
    setSelectedData({
      id: jam.id,
      nama: jam.nama,
      jamMulai: jam.jamMulai,
      jamSelesai: jam.jamSelesai,
      status: jam.status,
    });
    setModalOpen(true);
  };

  const requestDelete = (id: number) => {
    setRowToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const doDelete = async () => {
    if (!rowToDelete) return;

    const { error } = await supabase.from("jam").delete().eq("id", rowToDelete).select("*");

    if (error) {
      console.error(error);
      setErrorAddOpen(true);
      return;
    }

    setDeleteSuccessOpen(true);
    loadJam();
  };

  const handleConfirmDelete = () => {
    void doDelete();
    setConfirmDeleteOpen(false);
  };

  const handleSubmit = async (data: JamFormData) => {
    let errorOccurred = false;

    if (modalMode === "add") {
      const { error } = await supabase.from("jam").insert({
        nama: data.nama,
        jam_mulai: data.jamMulai,
        jam_selesai: data.jamSelesai,
        status: data.status,
      });

      if (error) {
        console.error(error);
        errorOccurred = true;
      } else {
        setAddSuccessOpen(true);
      }
    } else {
      const { error } = await supabase
        .from("jam")
        .update({
          nama: data.nama,
          jam_mulai: data.jamMulai,
          jam_selesai: data.jamSelesai,
          status: data.status,
        })
        .eq("id", Number(data.id));

      if (error) {
        console.error(error);
        errorOccurred = true;
      } else {
        setSaveSuccessOpen(true);
      }
    }

    setModalOpen(false);

    if (errorOccurred) {
      setErrorAddOpen(true);
      return;
    }

    loadJam();
  };

  // ===========================================
  // UI
  // ===========================================
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
              <th className="p-3 text-center">No.</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Jam Mulai</th>
              <th className="p-3">Jam Selesai</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Memuat...
                </td>
              </tr>
            )}

            {!loading &&
              paginated.map((j, i) => (
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

                      <button className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded text-xs flex items-center gap-1" onClick={() => requestDelete(j.id)}>
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
      <JamModal open={modalOpen} mode={modalMode} existingCount={jamData.length} initialData={selectedData} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />

      <ConfirmDeleteModal open={confirmDeleteOpen} onCancel={() => setConfirmDeleteOpen(false)} onConfirm={handleConfirmDelete} />

      <SuccessDeleteModal open={deleteSuccessOpen} onClose={() => setDeleteSuccessOpen(false)} />
      <SuccessAddModal open={addSuccessOpen} onClose={() => setAddSuccessOpen(false)} />
      <SuccessSaveModal open={saveSuccessOpen} onClose={() => setSaveSuccessOpen(false)} />
      <ErrorAddModal open={errorAddOpen} onClose={() => setErrorAddOpen(false)} />
    </div>
  );
}
