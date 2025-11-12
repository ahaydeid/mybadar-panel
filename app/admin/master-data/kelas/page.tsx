"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

// Contoh data dummy
const dataKelas: Kelas[] = [
  { no: 1, namaKelas: "X RPL 1", tingkat: "X", jurusan: "Rekayasa Perangkat Lunak", waliKelas: "Budi Santoso", jumlahSiswa: 35, tahunAjaran: "2024/2025", status: "Aktif" },
  { no: 2, namaKelas: "XI RPL 2", tingkat: "XI", jurusan: "Rekayasa Perangkat Lunak", waliKelas: "Siti Aisyah", jumlahSiswa: 34, tahunAjaran: "2024/2025", status: "Aktif" },
  { no: 3, namaKelas: "XII TKJ 1", tingkat: "XII", jurusan: "Teknik Komputer dan Jaringan", waliKelas: "Ahmad Fauzan", jumlahSiswa: 33, tahunAjaran: "2024/2025", status: "Aktif" },
  { no: 4, namaKelas: "X MM 1", tingkat: "X", jurusan: "Multimedia", waliKelas: "Rina Kusuma", jumlahSiswa: 36, tahunAjaran: "2024/2025", status: "Aktif" },
  { no: 5, namaKelas: "XI AKL 2", tingkat: "XI", jurusan: "Akuntansi dan Keuangan Lembaga", waliKelas: "Bayu Setiawan", jumlahSiswa: 32, tahunAjaran: "2024/2025", status: "Tidak Aktif" },
];

export default function MasterKelasPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [rowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);

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
          <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white cursor-pointer">
            <Plus className="w-4 h-4" />
            Tambah Kelas
          </Button>
        </div>
      </div>

      {/* TABEL */}
      <div className="rounded border border-gray-200 shadow-sm bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm text-left border-collapse">
            <thead className="bg-sky-100 text-gray-700 h-14">
              <tr>
                <th className="p-3 whitespace-nowrap">No</th>
                <th className="p-3 whitespace-nowrap">Nama Kelas</th>
                <th className="p-3 whitespace-nowrap">Tingkat</th>
                <th className="p-3 whitespace-nowrap">Jurusan</th>
                <th className="p-3 whitespace-nowrap">Wali Kelas</th>
                <th className="p-3 whitespace-nowrap">Jumlah Siswa</th>
                <th className="p-3 whitespace-nowrap">Tahun Ajaran</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {paginatedData.map((k) => (
                <tr key={k.no} className="border-b last:border-none hover:bg-sky-50 transition-colors">
                  <td className="p-3 whitespace-nowrap">{k.no}</td>
                  <td className="p-3 whitespace-nowrap font-medium">{k.namaKelas}</td>
                  <td className="p-3 whitespace-nowrap">{k.tingkat}</td>
                  <td className="p-3 whitespace-nowrap">{k.jurusan}</td>
                  <td className="p-3 whitespace-nowrap">{k.waliKelas}</td>
                  <td className="p-3 whitespace-nowrap text-center">{k.jumlahSiswa}</td>
                  <td className="p-3 whitespace-nowrap">{k.tahunAjaran}</td>
                  <td className={`p-3 whitespace-nowrap font-medium ${k.status === "Aktif" ? "text-emerald-600" : "text-rose-600"}`}>{k.status}</td>
                  <td className="p-3 whitespace-nowrap text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button className="flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium transition">
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>
                      <button className="flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium transition">
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      <button className="flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-md bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition">
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
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-3">
        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-600">
          {page} dari {totalPages || 1}
        </span>
        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
