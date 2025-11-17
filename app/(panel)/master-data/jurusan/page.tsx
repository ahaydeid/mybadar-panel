"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import JurusanModal, { JurusanFormData } from "./components/JurusanModal";
import { supabase } from "@/lib/supabase/client";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import SuccessAddModal from "@/app/components/SuccessAddModal";
import SuccessSaveModal from "@/app/components/SuccessSaveModal";
import SuccessDeleteModal from "@/app/components/SuccessDeleteModal";

export default function MasterJurusanPage() {
  const [jurusan, setJurusan] = React.useState<JurusanFormData[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selectedJurusan, setSelectedJurusan] = React.useState<JurusanFormData | undefined>();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [successAddOpen, setSuccessAddOpen] = React.useState(false);
  const [successSaveOpen, setSuccessSaveOpen] = React.useState(false);
  const [successDeleteOpen, setSuccessDeleteOpen] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<number | string | null>(null);

  const loadJurusan = async () => {
    setLoading(true);

    const { data, error } = await supabase.from("jurusan").select("*, guru:kepala_program (id, nama)").order("id", { ascending: true });

    if (!error && data) {
      setJurusan(
        data.map((j) => ({
          id: j.id,
          kode: j.kode,
          nama: j.nama,
          kepalaProgramId: j.kepala_program,
          kepalaProgram: j.guru?.nama ?? "-",
          deskripsi: j.deskripsi,
          singkatan: j.kode,
        }))
      );
    }

    setLoading(false);
  };

  React.useEffect(() => {
    loadJurusan();
  }, []);

  const handleSubmit = async (data: JurusanFormData) => {
    if (modalMode === "add") {
      const { error } = await supabase.from("jurusan").insert({
        kode: data.kode,
        nama: data.nama,
        kepala_program: data.kepalaProgramId ?? null,
        deskripsi: data.deskripsi ?? null,
      });

      if (!error) {
        await loadJurusan();
        setModalOpen(false);
        setSuccessAddOpen(true);
      }
    } else {
      if (!selectedJurusan || !selectedJurusan.id) {
        console.error("No selected jurusan id");
        return;
      }

      const { error } = await supabase
        .from("jurusan")
        .update({
          kode: data.kode,
          nama: data.nama,
          kepala_program: data.kepalaProgramId ?? null,
          deskripsi: data.deskripsi ?? null,
        })
        .eq("id", selectedJurusan.id);

      if (!error) {
        await loadJurusan();
        setModalOpen(false);
        setSuccessSaveOpen(true);
      }
    }
  };

  const handleDelete = (id: number | string) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;

    const { error } = await supabase.from("jurusan").delete().eq("id", deleteTargetId);

    if (!error) {
      await loadJurusan();
      setConfirmDeleteOpen(false);
      setSuccessDeleteOpen(true);
      setDeleteTargetId(null);
    }
  };

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

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Master Jurusan</h1>

        <Button onClick={handleAdd} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white">
          <Plus className="w-4 h-4" />
          Tambah Jurusan
        </Button>
      </div>

      <div className="rounded border border-gray-200 shadow-sm bg-white">
        <div className="w-full overflow-x-auto">
          {loading ? (
            <div className="p-4">Memuat data...</div>
          ) : (
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
                    <td className="p-3 font-semibold">{j.kode}</td>
                    <td className="p-3">{j.nama}</td>
                    <td className="p-3">{j.kepalaProgram || "-"}</td>
                    <td className="p-3">{j.deskripsi || "-"}</td>

                    <td className="p-3 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium" onClick={() => handleEdit(j)}>
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>

                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium" onClick={() => handleDelete(j.id!)}>
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <JurusanModal open={modalOpen} mode={modalMode} initialData={selectedJurusan} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <SuccessAddModal open={successAddOpen} onClose={() => setSuccessAddOpen(false)} />
      <SuccessSaveModal open={successSaveOpen} onClose={() => setSuccessSaveOpen(false)} />
      <SuccessDeleteModal open={successDeleteOpen} onClose={() => setSuccessDeleteOpen(false)} />
    </div>
  );
}
