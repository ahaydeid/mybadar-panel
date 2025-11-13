"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import KelasModal, { KelasFormData } from "@/app/(panel)/master-data/components/KelasModal";
import { ChevronLeft, ChevronRight, Plus, Eye, Pencil, Trash2 } from "lucide-react";

type Kelas = {
  no: number;
  namaKelas: string;
  tingkat: "X" | "XI" | "XII";
  jurusan: string;
  waliKelas: string;
  jumlahSiswa: number;
  tahunAjaran: string;
  status: "Aktif" | "Tidak Aktif";
};

// DATA DUMMY
const dataKelas: Kelas[] = [
  { no: 1, namaKelas: "X RPL 1", tingkat: "X", jurusan: "Rekayasa Perangkat Lunak", waliKelas: "Budi Santoso", jumlahSiswa: 0, tahunAjaran: "2024/2025", status: "Aktif" },
  { no: 2, namaKelas: "XI RPL 2", tingkat: "XI", jurusan: "Rekayasa Perangkat Lunak", waliKelas: "Siti Aisyah", jumlahSiswa: 0, tahunAjaran: "2024/2025", status: "Aktif" },
  { no: 3, namaKelas: "XII TKJ 1", tingkat: "XII", jurusan: "Teknik Komputer dan Jaringan", waliKelas: "Ahmad Fauzan", jumlahSiswa: 0, tahunAjaran: "2024/2025", status: "Aktif" },
  { no: 4, namaKelas: "X MM 1", tingkat: "X", jurusan: "Multimedia", waliKelas: "Rina Kusuma", jumlahSiswa: 0, tahunAjaran: "2024/2025", status: "Aktif" },
  { no: 5, namaKelas: "XI AKL 2", tingkat: "XI", jurusan: "Akuntansi dan Keuangan Lembaga", waliKelas: "Bayu Setiawan", jumlahSiswa: 0, tahunAjaran: "2024/2025", status: "Tidak Aktif" },
];

export default function MasterKelasPage(): React.ReactElement {
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const [selectedKelas, setSelectedKelas] = React.useState<KelasFormData | null>(null);
  const [page, setPage] = React.useState<number>(1);

  const rowsPerPage = 10;

  const filteredData = dataKelas.filter((k) => k.namaKelas.toLowerCase().includes(searchTerm.toLowerCase()) || k.jurusan.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Data Kelas</h1>

        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Cari kelas atau jurusan..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />

          <Button
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
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

      {/* TABEL */}
      <div className="rounded border border-gray-200 shadow-sm bg-white">
        <div className="w-full overflow-x-auto">
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
              {paginatedData.map((k) => (
                <tr key={k.no} className="border-b hover:bg-sky-50 transition">
                  <td className="p-3">{k.no}</td>
                  <td className="p-3 font-medium">{k.namaKelas}</td>
                  <td className="p-3">{k.tingkat}</td>
                  <td className="p-3">{k.jurusan}</td>
                  <td className="p-3">{k.waliKelas}</td>
                  <td className="p-3 text-center">0</td>
                  <td className="p-3">{k.tahunAjaran}</td>
                  <td className={`p-3 font-medium ${k.status === "Aktif" ? "text-emerald-600" : "text-rose-600"}`}>{k.status}</td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs rounded-md flex items-center gap-1.5">
                        <Eye className="w-4 h-4" /> Detail
                      </button>

                      <button
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-md flex items-center gap-1.5"
                        onClick={() => {
                          setSelectedKelas({
                            id: k.namaKelas.replace(/\s+/g, "-").toLowerCase(),
                            namaKelas: k.namaKelas,
                            tingkat: k.tingkat,
                            jurusan: k.jurusan,
                            waliKelas: k.waliKelas,
                            jumlahSiswa: 0,
                            tahunAjaran: k.tahunAjaran,
                            status: k.status,
                          });
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>

                      <button className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs rounded-md flex items-center gap-1.5">
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
      <KelasModal
        open={isModalOpen}
        mode={selectedKelas ? "edit" : "add"}
        initialData={selectedKelas ?? undefined}
        onClose={() => {
          setModalOpen(false);
          setSelectedKelas(null);
        }}
        onSubmit={(data) => {
          console.log("KELAS SUBMIT:", data);
          setModalOpen(false);
          setSelectedKelas(null);
        }}
      />
    </div>
  );
}
