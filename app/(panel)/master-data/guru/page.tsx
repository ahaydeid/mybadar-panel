"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import GuruModal, { GuruFormData } from "./components/GuruModal";
import GuruTable, { GuruTableItem } from "./components/GuruTable";

import SuccessAddModal from "@/app/components/SuccessAddModal";
import SuccessSaveModal from "@/app/components/SuccessSaveModal";
import SuccessDeleteModal from "@/app/components/SuccessDeleteModal";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import ImportGuruModal from "./components/ImportGuruModal";

import { ChevronLeft, ChevronRight, UserPlus, Upload, Download, FileSpreadsheet } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type GuruMapelJoin = {
  mata_pelajaran:
    | {
        nama: string | null;
      }[]
    | null;
};

type GuruQueryRow = {
  id: number;
  nama: string | null;
  nuptk: string | null;
  jk: "L" | "P";
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  nik: string | null;
  nip: string | null;
  jenis_ptk: string | null;
  gelar: string | null;
  jenjang: string | null;
  prodi: string | null;
  sertifikasi: string | null;
  tmt_kerja: string | null;
  tugas_tambahan: string | null;
  kompetensi: string | null;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
  guru_mapel: GuruMapelJoin[] | null;
};

type Guru = {
  id: number;
  no: number;
  nama: string;
  nuptk: string;
  jk: "L" | "P";
  tempatLahir: string;
  tanggalLahir: string;
  nik: string;
  nip: string | "-";
  jenisPTK: string;
  gelar: string;
  jenjang: string;
  prodi: string;
  sertifikasi: string;
  tmtKerja: string;
  tugasTambahan: string | "-";
  mengajar: string[];
  kompetensi: string;
  status: "Aktif" | "Tidak Aktif";
};

export default function MasterGuruPage() {
  const router = useRouter();

  const [dataGuru, setDataGuru] = React.useState<Guru[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selectedGuru, setSelectedGuru] = React.useState<GuruFormData | null>(null);
  const [selectedGuruId, setSelectedGuruId] = React.useState<number | null>(null);

  const [showSuccessAdd, setShowSuccessAdd] = React.useState(false);
  const [showSuccessSave, setShowSuccessSave] = React.useState(false);
  const [showSuccessDelete, setShowSuccessDelete] = React.useState(false);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<number | null>(null);

  const [importOpen, setImportOpen] = React.useState(false);

  // =====================================================
  // FETCH DATA
  // =====================================================
  const fetchGuru = React.useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("guru")
      .select(
        `
        id, nama, nuptk, jk, tempat_lahir, tanggal_lahir, nik, nip,
        jenis_ptk, gelar, jenjang, prodi, sertifikasi,
        tmt_kerja, tugas_tambahan, kompetensi, status, created_at,
        guru_mapel (
          mata_pelajaran ( nama )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error || !data) {
      setLoading(false);
      setDataGuru([]);
      return;
    }

    const rows = data as unknown as GuruQueryRow[];

    const mapped: Guru[] = rows.map((row, idx) => {
      const mengajar =
        row.guru_mapel
          ?.flatMap((gm) => gm.mata_pelajaran ?? [])
          .map((mp) => mp.nama)
          .filter((x): x is string => Boolean(x)) ?? [];

      return {
        id: row.id,
        no: idx + 1,
        nama: row.nama ?? "",
        nuptk: row.nuptk ?? "",
        jk: row.jk,
        tempatLahir: row.tempat_lahir ?? "",
        tanggalLahir: row.tanggal_lahir ?? "",
        nik: row.nik ?? "",
        nip: row.nip ?? "-",
        jenisPTK: row.jenis_ptk ?? "",
        gelar: row.gelar ?? "",
        jenjang: row.jenjang ?? "",
        prodi: row.prodi ?? "",
        sertifikasi: row.sertifikasi ?? "",
        tmtKerja: row.tmt_kerja ?? "",
        tugasTambahan: row.tugas_tambahan ?? "-",
        mengajar,
        kompetensi: row.kompetensi ?? "",
        status: row.status === "INACTIVE" ? "Tidak Aktif" : "Aktif",
      };
    });

    setDataGuru(mapped);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchGuru();
  }, [fetchGuru]);

  // =====================================================
  // FILTER + PAGINATION
  // =====================================================
  const filtered = dataGuru.filter((g) => g.nama.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const tableData: GuruTableItem[] = paginated.map((g) => ({ ...g }));

  // =====================================================
  // CRUD HANDLERS
  // =====================================================
  const handleOpenAdd = () => {
    setModalMode("add");
    setSelectedGuru(null);
    setSelectedGuruId(null);
    setModalOpen(true);
  };

  const handleAskDelete = (id: number) => {
    setDeleteTargetId(id);
    setConfirmDeleteOpen(true);
  };

  const handleOpenEdit = async (g: GuruTableItem) => {
    setModalMode("edit");
    setSelectedGuruId(g.id);

    const { data: relasi } = await supabase.from("guru_mapel").select("mapel_id").eq("guru_id", g.id);
    const mapelIds = (relasi ?? []).map((r) => r.mapel_id as number);

    setSelectedGuru({
      id: g.id,
      nama: g.nama,
      nuptk: g.nuptk,
      jk: g.jk,
      tempatLahir: g.tempatLahir,
      tanggalLahir: g.tanggalLahir,
      nik: g.nik,
      nip: g.nip,
      jenisPTK: g.jenisPTK,
      gelar: g.gelar,
      jenjang: g.jenjang,
      prodi: g.prodi,
      sertifikasi: g.sertifikasi,
      tmtKerja: g.tmtKerja,
      tugasTambahan: g.tugasTambahan === "-" ? "" : g.tugasTambahan,
      kompetensi: g.kompetensi,
      status: g.status === "Tidak Aktif" ? "INACTIVE" : "ACTIVE",
      mapelIds,
    });

    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    await supabase.from("guru").delete().eq("id", deleteTargetId);
    setConfirmDeleteOpen(false);
    setShowSuccessDelete(true);
    fetchGuru();
  };

  const handleSubmitGuru = async (data: GuruFormData) => {
    const payload = {
      nama: data.nama,
      nuptk: data.nuptk,
      jk: data.jk,
      tempat_lahir: data.tempatLahir,
      tanggal_lahir: data.tanggalLahir,
      nik: data.nik,
      nip: data.nip === "-" ? null : data.nip,
      jenis_ptk: data.jenisPTK,
      gelar: data.gelar,
      jenjang: data.jenjang,
      prodi: data.prodi,
      sertifikasi: data.sertifikasi,
      tmt_kerja: data.tmtKerja,
      tugas_tambahan: data.tugasTambahan,
      kompetensi: data.kompetensi,
      status: data.status,
    };

    let guruId = selectedGuruId;

    if (modalMode === "add") {
      const { data: inserted } = await supabase.from("guru").insert(payload).select("id").single();
      guruId = inserted?.id ?? null;

      if (guruId && data.mapelIds.length > 0) {
        const rows = data.mapelIds.map((mapelId) => ({ guru_id: guruId, mapel_id: mapelId }));
        await supabase.from("guru_mapel").insert(rows);
      }

      setShowSuccessAdd(true);
    } else if (modalMode === "edit" && guruId) {
      await supabase.from("guru").update(payload).eq("id", guruId);
      await supabase.from("guru_mapel").delete().eq("guru_id", guruId);

      if (data.mapelIds.length > 0) {
        const rows = data.mapelIds.map((mapelId) => ({ guru_id: guruId, mapel_id: mapelId }));
        await supabase.from("guru_mapel").insert(rows);
      }

      setShowSuccessSave(true);
    }

    setModalOpen(false);
    fetchGuru();
  };

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button className="bg-sky-600 text-white" onClick={handleOpenAdd}>
              <UserPlus className="w-4 h-4" /> Tambah Guru
            </Button>

            <Button className="bg-emerald-600 text-white" onClick={() => setImportOpen(true)}>
              <Upload className="w-4 h-4" /> Import
            </Button>

            <Button className="bg-amber-500 text-white">
              <Download className="w-4 h-4" /> Export
            </Button>

            <Button className="bg-gray-100 border text-gray-800">
              <FileSpreadsheet className="w-4 h-4" /> Unduh Template
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold">Data Guru</h1>

          <div className="flex items-center gap-3">
            <Select value={rowsPerPage.toString()} onValueChange={(v) => (setRowsPerPage(Number(v)), setPage(1))}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input placeholder="Cari nama..." className="w-64" value={searchTerm} onChange={(e) => (setSearchTerm(e.target.value), setPage(1))} />
          </div>
        </div>
      </div>

      <GuruTable data={tableData} loading={loading} onEdit={handleOpenEdit} onDelete={handleAskDelete} onDetail={(g) => router.push(`/master-data/guru/${g.id}`)} />

      <div className="flex justify-end items-center gap-3">
        <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm">
          {page} dari {totalPages}
        </span>

        <Button variant="outline" size="icon" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <GuruModal open={isModalOpen} mode={modalMode} initialData={selectedGuru ?? undefined} onClose={() => setModalOpen(false)} onSubmit={handleSubmitGuru} />

      <SuccessAddModal open={showSuccessAdd} onClose={() => setShowSuccessAdd(false)} message="Guru berhasil ditambahkan." />
      <SuccessSaveModal open={showSuccessSave} onClose={() => setShowSuccessSave(false)} message="Perubahan data guru berhasil disimpan." />
      <SuccessDeleteModal open={showSuccessDelete} onClose={() => setShowSuccessDelete(false)} message="Data guru berhasil dihapus." />

      <ConfirmDeleteModal open={confirmDeleteOpen} title="Hapus Guru" message="Yakin ingin menghapus guru ini?" onCancel={() => setConfirmDeleteOpen(false)} onConfirm={handleConfirmDelete} />

      <ImportGuruModal open={importOpen} onClose={() => setImportOpen(false)} onImported={fetchGuru} />
    </div>
  );
}
