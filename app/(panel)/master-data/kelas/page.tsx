"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import KelasModal, { KelasFormData } from "./components/KelasModal";

import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import SuccessAddModal from "@/app/components/SuccessAddModal";
import SuccessSaveModal from "@/app/components/SuccessSaveModal";
import SuccessDeleteModal from "@/app/components/SuccessDeleteModal";

type KelasRow = {
  id: number;
  nama_rombel: string;
  tingkat: number;
  jurusan: { id: number; nama: string } | null;
  wali_guru: { id: number; nama: string } | null;
  jumlah_siswa: number;
  tahun_ajaran: string;
  status: "ACTIVE" | "INACTIVE";
};

type KelasTableItem = {
  id: number;
  no: number;
  namaKelas: string;
  tingkat: "X" | "XI" | "XII";
  jurusanId: number | null;
  jurusanNama: string;
  waliId: number | null;
  waliNama: string;
  jumlahSiswa: number;
  tahunAjaran: string;
  status: "ACTIVE" | "INACTIVE";
};

export default function MasterKelasPage(): React.ReactElement {
  const [data, setData] = React.useState<KelasTableItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [selectedKelas, setSelectedKelas] = React.useState<KelasFormData | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [successAddOpen, setSuccessAddOpen] = React.useState(false);
  const [successSaveOpen, setSuccessSaveOpen] = React.useState(false);
  const [successDeleteOpen, setSuccessDeleteOpen] = React.useState(false);

  const [deleteTargetId, setDeleteTargetId] = React.useState<number | null>(null);

  const fetchKelas = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("kelas_with_jumlah_siswa")
      .select(
        `
      id,
      nama_rombel,
      tingkat,
      jurusan_id,
      wali_guru_id,
      jumlah_siswa,
      tahun_ajaran,
      status,
      jurusan:jurusan(id,nama),
      wali_guru:guru(id,nama)
    `
      )
      .order("id", { ascending: true })
      .returns<KelasRow[]>();

    if (!error && data) {
      const mapped: KelasTableItem[] = data.map((row: KelasRow, index: number) => ({
        id: row.id,
        no: index + 1,
        namaKelas: row.nama_rombel,
        tingkat: (row.tingkat === 1 ? "X" : row.tingkat === 2 ? "XI" : "XII") as KelasTableItem["tingkat"],
        jurusanId: row.jurusan?.id ?? null,
        jurusanNama: row.jurusan?.nama ?? "",
        waliId: row.wali_guru?.id ?? null,
        waliNama: row.wali_guru?.nama ?? "",
        jumlahSiswa: row.jumlah_siswa,
        tahunAjaran: row.tahun_ajaran,
        status: row.status,
      }));

      setData(mapped);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    fetchKelas();
  }, []);

  const filtered = data.filter((k) => k.namaKelas.toLowerCase().includes(searchTerm.toLowerCase()) || k.jurusanNama.toLowerCase().includes(searchTerm.toLowerCase()) || k.waliNama.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSubmit = async (form: KelasFormData) => {
    const payload = {
      nama_rombel: form.namaKelas,
      tingkat: form.tingkat === "X" ? 1 : form.tingkat === "XI" ? 2 : 3,
      jurusan_id: form.jurusanId,
      wali_guru_id: form.waliId,
      tahun_ajaran: form.tahunAjaran,
      status: form.status,
    };

    if (form.id === null) {
      const { error } = await supabase.from("kelas").insert(payload);

      if (!error) {
        setModalOpen(false);
        setSelectedKelas(null);
        fetchKelas();
        setSuccessAddOpen(true);
      }
    } else {
      const { error } = await supabase.from("kelas").update(payload).eq("id", form.id);

      if (!error) {
        setModalOpen(false);
        setSelectedKelas(null);
        fetchKelas();
        setSuccessSaveOpen(true);
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId === null) return;

    const { error } = await supabase.from("kelas").delete().eq("id", deleteTargetId);

    if (!error) {
      await fetchKelas();
      setConfirmDeleteOpen(false);
      setSuccessDeleteOpen(true);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Data Kelas</h1>

        <div className="flex items-center gap-3">
          <Input
            placeholder="Cari kelas atau jurusan..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />

          <Button
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white"
            onClick={() => {
              setSelectedKelas(null);
              setModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Tambah Kelas
          </Button>
        </div>
      </div>

      <div className="rounded border border-gray-200 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-sky-100 text-gray-700 h-14">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Nama Rombel</th>
                <th className="p-3">Tingkat</th>
                <th className="p-3">Jurusan</th>
                <th className="p-3">Wali Kelas</th>
                <th className="p-3">Jumlah Siswa</th>
                <th className="p-3">Tahun Ajaran</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-4 text-center">
                    Memuat data...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-4 text-center">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                paginated.map((k) => (
                  <tr key={k.id} className="border-b hover:bg-sky-50">
                    <td className="p-3">{k.no}</td>
                    <td className="p-3 font-medium">{k.namaKelas}</td>
                    <td className="p-3">{k.tingkat}</td>
                    <td className="p-3">{k.jurusanNama}</td>
                    <td className="p-3">{k.waliNama}</td>
                    <td className="p-3 text-center">{k.jumlahSiswa}</td>
                    <td className="p-3">{k.tahunAjaran}</td>
                    <td className="p-3">{k.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}</td>

                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="px-3 py-2 bg-amber-500 text-white rounded-md flex items-center gap-1"
                          onClick={() => {
                            setSelectedKelas(k);
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>

                        <button className="px-3 py-2 bg-rose-500 text-white rounded-md flex items-center gap-1" onClick={() => handleDeleteClick(k.id)}>
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm">
          {page} dari {totalPages}
        </span>

        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <KelasModal
        open={isModalOpen}
        mode={selectedKelas ? "edit" : "add"}
        initialData={selectedKelas ?? undefined}
        onClose={() => {
          setModalOpen(false);
          setSelectedKelas(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onCancel={() => {
          setConfirmDeleteOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={confirmDelete}
      />

      <SuccessAddModal open={successAddOpen} onClose={() => setSuccessAddOpen(false)} />
      <SuccessSaveModal open={successSaveOpen} onClose={() => setSuccessSaveOpen(false)} />
      <SuccessDeleteModal open={successDeleteOpen} onClose={() => setSuccessDeleteOpen(false)} />
    </div>
  );
}
