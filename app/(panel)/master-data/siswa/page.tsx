"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import SiswaModal, { SiswaFormData } from "./components/SiswaModal";
import SiswaTable from "./components/SiswaTable";
import ImportSiswaModal from "./components/ImportSiswaModal";
import SuccessAddModal from "@/app/components/SuccessAddModal";
import SuccessSaveModal from "@/app/components/SuccessSaveModal";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import SuccessDeleteModal from "@/app/components/SuccessDeleteModal";

import { ChevronLeft, ChevronRight, UserPlus, Upload, Download, FileSpreadsheet } from "lucide-react";

// ===========================
// TYPE SESUAI DATABASE
// ===========================
export interface SiswaRow {
  id: number;
  nama: string;
  nipd: string | null;
  nisn: string | null;
  jk: "L" | "P";
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  nik: string | null;
  agama: string | null;
  alamat: string | null;
  rt: string | null;
  rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kode_pos: string | null;

  kelas_id: number | null;
  kelas?: { nama_rombel: string } | null;

  jurusan_id: number | null;
  jurusan?: { kode: string } | null;

  tahun_masuk: number | null;
  semester: number | null;
  status: string;
  hp: string | null;
  email: string | null;
}

// ===========================
// MAIN PAGE
// ===========================
export default function MasterSiswaPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SiswaRow[]>([]);
  const router = useRouter();

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<SiswaFormData | undefined>();
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openImport, setOpenImport] = useState(false);
  const [showSuccessImport, setShowSuccessImport] = useState(false);

  // Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // ===========================
  // FETCH SISWA (SAFE VERSION)
  // ===========================
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("siswa")
        .select(
          `*,
    kelas:kelas_id ( nama_rombel ),
    jurusan:jurusan_id ( kode )
  `
        )
        .order("id", { ascending: false });

      if (!ignore) {
        if (error) console.error("FETCH ERROR:", error);
        setRows(data ?? []);
        setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  // ===========================
  // RELOAD AFTER SAVE/DELETE
  // ===========================
  const reload = async () => {
    const { data } = await supabase
      .from("siswa")
      .select(
        `
      *,
      kelas:kelas_id ( nama_rombel ),
      jurusan:jurusan_id ( kode )
    `
      )
      .order("id", { ascending: false });

    setRows(data ?? []);
  };

  // ===========================
  // SUBMIT ADD / EDIT
  // ===========================
  const handleSubmit = async (form: SiswaFormData) => {
    const payload = {
      nama: form.nama || null,
      nipd: form.nipd || null,
      nisn: form.nisn || null,
      jk: form.jk,

      tempat_lahir: form.tempatLahir || null,
      tanggal_lahir: form.tanggalLahir || null,
      nik: form.nik || null,

      // ENUM wajib uppercase untuk aman
      agama: form.agama ? form.agama.toUpperCase() : null,

      alamat: form.alamat || null,
      rt: form.rt || null,
      rw: form.rw || null,
      kelurahan: form.kelurahan || null,
      kecamatan: form.kecamatan || null,
      kode_pos: form.kodePos || null,

      // BIGINT
      kelas_id: form.kelasId ? Number(form.kelasId) : null,
      jurusan_id: form.jurusanId ? Number(form.jurusanId) : null,

      // INTEGER
      tahun_masuk: form.tahunMasuk ? Number(form.tahunMasuk) : null,
      semester: form.semester ? Number(form.semester) : null,

      // ENUM siswa_status_enum
      status: form.status ? form.status.toUpperCase() : "AKTIF",

      hp: form.hp || null,
      email: form.email || null,
    };

    if (modalMode === "add") {
      const { error } = await supabase.from("siswa").insert(payload);
      if (!error) setShowAddSuccess(true);
      else console.error("Insert error:", error);
    } else {
      const { error } = await supabase.from("siswa").update(payload).eq("id", Number(form.id));
      if (!error) setShowSaveSuccess(true);
      else console.error("Update error:", error);
    }

    setOpenModal(false);
    reload();
  };

  // ===========================
  // DELETE
  // ===========================

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    const { error } = await supabase.from("siswa").delete().eq("id", deleteId);
    if (!error) {
      setShowDeleteSuccess(true);
    }

    setShowConfirmDelete(false);
    setDeleteId(null);
    reload();
  };

  const handleAskDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  // ===========================
  // PAGINATION + FILTER
  // ===========================
  const filtered = rows.filter((r) => r.nama.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const start = (page - 1) * rowsPerPage;
  const paginated = filtered.slice(start, start + rowsPerPage);

  const numbered = paginated.map((r, idx) => ({
    ...r,
    no: start + idx + 1,
  }));

  // ===========================
  // OPEN MODAL
  // ===========================
  const openAdd = () => {
    setModalMode("add");
    setSelected(undefined);
    setOpenModal(true);
  };

  const openEdit = (s: SiswaRow) => {
    setModalMode("edit");

    setSelected({
      id: s.id.toString(),
      nama: s.nama,
      nipd: s.nipd ?? "",
      nisn: s.nisn ?? "",
      jk: s.jk,
      tempatLahir: s.tempat_lahir ?? "",
      tanggalLahir: s.tanggal_lahir ?? "",
      nik: s.nik ?? "",
      agama: s.agama ?? "ISLAM",
      alamat: s.alamat ?? "",
      rt: s.rt ?? "",
      rw: s.rw ?? "",
      kelurahan: s.kelurahan ?? "",
      kecamatan: s.kecamatan ?? "",
      kodePos: s.kode_pos ?? "",
      kelasId: s.kelas_id?.toString() ?? "",
      jurusanId: s.jurusan_id?.toString() ?? "",
      tahunMasuk: s.tahun_masuk ?? "",
      semester: s.semester ?? "",
      status: s.status,
      hp: s.hp ?? "",
      email: s.email ?? "",
    });

    setOpenModal(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER FILTER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white" onClick={openAdd}>
              <UserPlus className="w-4 h-4" />
              Tambah Siswa
            </Button>

            <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setOpenImport(true)}>
              <Upload className="w-4 h-4" />
              Import
            </Button>

            <Button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white">
              <Download className="w-4 h-4" />
              Export
            </Button>

            <Button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300">
              <FileSpreadsheet className="w-4 h-4 text-gray-700" />
              Unduh Template
            </Button>
          </div>
        </div>

        {/* Title + Filter */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Data Siswa</h1>

          <div className="flex items-center gap-3">
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(v) => {
                setRowsPerPage(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Cari nama..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-64"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <SiswaTable data={numbered} loading={loading} onEdit={openEdit} onDelete={handleAskDelete} onDetail={(s) => router.push(`/master-data/siswa/${s.id}`)} />

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm text-gray-600">
          {page} dari {totalPages || 1}
        </span>

        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* MODAL */}
      <SiswaModal open={openModal} mode={modalMode} initialData={selected} onClose={() => setOpenModal(false)} onSubmit={handleSubmit} />
      <ImportSiswaModal
        open={openImport}
        onClose={() => setOpenImport(false)}
        onImported={() => {
          setShowSuccessImport(true);
          reload();
        }}
      />

      <SuccessAddModal open={showSuccessImport} onClose={() => setShowSuccessImport(false)} message="Import data siswa berhasil." />
      <SuccessAddModal open={showAddSuccess} onClose={() => setShowAddSuccess(false)} />
      <SuccessSaveModal open={showSaveSuccess} onClose={() => setShowSaveSuccess(false)} />
      <ConfirmDeleteModal open={showConfirmDelete} onCancel={() => setShowConfirmDelete(false)} onConfirm={handleDeleteConfirm} />
      <SuccessDeleteModal open={showDeleteSuccess} onClose={() => setShowDeleteSuccess(false)} />
    </div>
  );
}
