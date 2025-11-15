"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SemesterModal, { SemesterFormData } from "@/app/(panel)/config/components/SemesterModal";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Semester = {
  id: number;
  namaSemester: string;
  tahunAjaran: string;
  jenis: "Ganjil" | "Genap";
  status: "Aktif" | "Tidak Aktif";
};

export default function ConfigSemesterPage() {
  const supabase = createClientComponentClient();

  const [dataSemester, setDataSemester] = React.useState<Semester[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selected, setSelected] = React.useState<SemesterFormData | undefined>();

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  // ===============================
  // LOAD DATA
  // ===============================
  const loadSemester = React.useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase.from("semester").select("id, nama, tipe, tahun_ajaran, status").order("id", { ascending: true });

    if (error) {
      console.error("Load semester error:", error);
      setLoading(false);
      return;
    }

    const mapped: Semester[] = (data ?? []).map((row) => ({
      id: row.id,
      namaSemester: row.nama,
      tahunAjaran: row.tahun_ajaran,
      jenis: row.tipe === "GANJIL" ? "Ganjil" : "Genap",
      status: row.status === "ACTIVE" ? "Aktif" : "Tidak Aktif",
    }));

    setDataSemester(mapped);
    setLoading(false);
  }, [supabase]);

  React.useEffect(() => {
    loadSemester();
  }, [loadSemester]);

  // ===============================
  // FILTER + PAGINATION
  // ===============================
  const filtered = dataSemester.filter((s) => `${s.namaSemester} ${s.tahunAjaran}`.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ===============================
  // OPEN MODAL
  // ===============================
  const openAddModal = () => {
    setSelected(undefined);
    setModalMode("add");
    setModalOpen(true);
  };

  const openEditModal = (item: Semester) => {
    setSelected({
      id: item.id,
      namaSemester: item.namaSemester,
      tahunAjaran: item.tahunAjaran,
      jenis: item.jenis,
      status: item.status,
    });

    setModalMode("edit");
    setModalOpen(true);
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("semester").delete().eq("id", id).select("*");

    if (error) {
      alert("Tidak bisa menghapus karena sedang digunakan di tabel lain.");
      console.error(error);
      return;
    }

    loadSemester();
  };

  // ===============================
  // SUBMIT ADD/EDIT
  // ===============================
  const handleSubmit = async (data: SemesterFormData) => {
    const dbJenis = data.jenis === "Ganjil" ? "GANJIL" : "GENAP";
    const dbStatus = data.status === "Aktif" ? "ACTIVE" : "INACTIVE";

    if (modalMode === "add") {
      await supabase.from("semester").insert({
        nama: data.namaSemester,
        tipe: dbJenis,
        tahun_ajaran: data.tahunAjaran,
        status: dbStatus,
      });
    } else if (data.id !== null) {
      await supabase
        .from("semester")
        .update({
          nama: data.namaSemester,
          tipe: dbJenis,
          tahun_ajaran: data.tahunAjaran,
          status: dbStatus,
        })
        .eq("id", data.id);
    }

    setModalOpen(false);
    loadSemester();
  };

  // ===============================
  // UI
  // ===============================
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

          <Button className="flex items-center gap-2 bg-sky-600 text-white" onClick={openAddModal}>
            <Plus className="w-4 h-4" /> Tambah Semester
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded border bg-white shadow-sm">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-sky-100 text-gray-700">
            <tr>
              <th className="p-3 text-center">No</th>
              <th className="p-3">Nama Semester</th>
              <th className="p-3">Tahun Ajaran</th>
              <th className="p-3">Jenis</th>
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
              paginated.map((s, i) => (
                <tr key={s.id} className="border-b hover:bg-sky-50">
                  <td className="p-3 text-center">{(page - 1) * rowsPerPage + i + 1}</td>
                  <td className="p-3">{s.namaSemester}</td>
                  <td className="p-3">{s.tahunAjaran}</td>
                  <td className="p-3">{s.jenis}</td>
                  <td className={`p-3 ${s.status === "Aktif" ? "text-emerald-600" : "text-rose-600"}`}>{s.status}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="px-3 py-1.5 bg-amber-500 text-white rounded text-xs flex items-center gap-1" onClick={() => openEditModal(s)}>
                        <Pencil className="w-4 h-4" /> Edit
                      </button>

                      <button className="px-3 py-1.5 bg-rose-500 text-white rounded text-xs flex items-center gap-1" onClick={() => handleDelete(s.id)}>
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
      <div className="flex justify-end gap-3">
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
      <SemesterModal open={modalOpen} mode={modalMode} initialData={selected} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
