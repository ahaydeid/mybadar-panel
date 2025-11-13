"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MataPelajaranModal, { MapelFormData } from "@/app/(panel)/master-data/components/MataPelajaranModal";
import { ChevronLeft, ChevronRight, Plus, Eye, Pencil, Trash2 } from "lucide-react";

// =============================
// TYPE DEFINISI DATA MAPEL
// =============================
type MataPelajaran = {
  no: number;
  kode: string;
  nama: string;
  kategori: "Umum" | "C1" | "C2" | "C3";
  tingkat: "X" | "XI" | "XII";
  jurusan: string[];
  jp: number;
  status: "Aktif" | "Tidak Aktif";
};

// =============================
// DUMMY DATA REALISTIK SMK
// =============================
const dataMapel: MataPelajaran[] = [
  {
    no: 1,
    kode: "RPL-DASAR-01",
    nama: "Pemrograman Dasar",
    kategori: "C1",
    tingkat: "X",
    jurusan: ["RPL", "TKJ"],
    jp: 6,
    status: "Aktif",
  },
  {
    no: 2,
    kode: "RPL-WEB-02",
    nama: "Pemrograman Web",
    kategori: "C2",
    tingkat: "XI",
    jurusan: ["RPL"],
    jp: 8,
    status: "Aktif",
  },
  {
    no: 3,
    kode: "TKJ-JARINGAN-01",
    nama: "Jaringan Dasar",
    kategori: "C1",
    tingkat: "X",
    jurusan: ["TKJ"],
    jp: 6,
    status: "Aktif",
  },
  {
    no: 4,
    kode: "MM-DESAIN-01",
    nama: "Desain Grafis",
    kategori: "C2",
    tingkat: "XI",
    jurusan: ["MM"],
    jp: 6,
    status: "Aktif",
  },
  {
    no: 5,
    kode: "AKL-AKUNTANSI-01",
    nama: "Akuntansi Dasar",
    kategori: "C1",
    tingkat: "X",
    jurusan: ["AKL"],
    jp: 6,
    status: "Tidak Aktif",
  },
];

export default function MasterMapelPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [selectedMapel, setSelectedMapel] = React.useState<MapelFormData | null>(null);
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const filtered = dataMapel.filter((m) => m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || m.kode.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Data Mata Pelajaran</h1>

        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Cari nama / kode mapel..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />

          <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Tambah Mapel
          </Button>
        </div>
      </div>

      {/* TABEL */}
      <div className="rounded border border-gray-200 bg-white shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm border-collapse">
            <thead className="bg-sky-100 text-gray-700 h-14">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Kode Mapel</th>
                <th className="p-3">Nama Mata Pelajaran</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Tingkat</th>
                <th className="p-3">Jurusan</th>
                <th className="p-3">JP/Minggu</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((m) => (
                <tr key={m.no} className="border-b last:border-none hover:bg-sky-50 transition">
                  <td className="p-3">{m.no}</td>
                  <td className="p-3 font-medium">{m.kode}</td>
                  <td className="p-3">{m.nama}</td>
                  <td className="p-3">{m.kategori}</td>
                  <td className="p-3">{m.tingkat}</td>
                  <td className="p-3">{m.jurusan.join(", ")}</td>
                  <td className="p-3">{m.jp} JP</td>
                  <td className={`p-3 font-medium ${m.status === "Aktif" ? "text-emerald-600" : "text-rose-600"}`}>{m.status}</td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-xs flex items-center gap-1.5">
                        <Eye className="w-4 h-4" /> Detail
                      </button>
                      <button
                        className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs flex items-center gap-1.5"
                        onClick={() => {
                          setSelectedMapel({
                            id: m.kode,
                            kode: m.kode,
                            nama: m.nama,
                            kategori: m.kategori,
                            tingkat: m.tingkat,
                            jurusan: m.jurusan,
                            jp: m.jp,
                            status: m.status,
                          });
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" /> Edit
                      </button>

                      <button className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md text-xs flex items-center gap-1.5">
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

        <span className="text-gray-600 text-sm">
          {page} dari {totalPages || 1}
        </span>

        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <MataPelajaranModal
        open={isModalOpen}
        mode={selectedMapel ? "edit" : "add"}
        initialData={selectedMapel ?? undefined}
        onClose={() => {
          setModalOpen(false);
          setSelectedMapel(null);
        }}
        onSubmit={(data: MapelFormData) => {
          console.log("MAPEL DISUBMIT:", data);
          setModalOpen(false);
          setSelectedMapel(null);
        }}
      />
    </div>
  );
}
