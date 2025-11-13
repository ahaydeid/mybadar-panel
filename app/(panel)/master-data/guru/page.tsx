"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import GuruModal, { GuruFormData } from "@/app/(panel)/master-data/components/GuruModal";

import { ChevronLeft, ChevronRight, UserPlus, Upload, Download, FileSpreadsheet, Eye, Pencil, Trash2 } from "lucide-react";

// ==============================
// TYPE DEFINISI DATA GURU
// ==============================
type Guru = {
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
  status: string;
};

// ==============================
// DUMMY DATA — REALISTIK
// ==============================
const tempatLahirList = ["Tangerang", "Serang", "Jakarta", "Bogor", "Bekasi", "Bandung"];
const jenisPTKList = ["Guru Mapel", "Guru Produktif", "Guru BK", "Kepala Sekolah", "Wakasek Kurikulum"];
const jenjangList = ["S1", "S2"];
const prodiList = ["Pendidikan Informatika", "Pendidikan Akuntansi", "Teknik Komputer", "Pendidikan Bahasa Indonesia", "Pendidikan Matematika"];
const sertifikasiList = ["PPG Dalam Jabatan", "Belum Sertifikasi", "PLPG"];
const tugasTambahanList = ["-", "Wali Kelas", "Ketua Jurusan", "Pembina Ekstrakurikuler"];

const guruNames = ["Agus Suryanto", "Siti Maryati", "Hendra Wijaya", "Lilis Kurniawati", "Rahmat Fauzi", "Nurlela Sari", "Budi Prasetyo", "Mega Lestari", "Deni Pratama", "Ayu Kartika"];

const mapelList = ["Pemrograman Web", "Basis Data", "Jaringan Dasar", "Akuntansi Dasar", "Bahasa Indonesia", "Matematika", "PKK", "Simulasi Digital", "Kewirausahaan", "Produktif RPL"];

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start: number, end: number): string {
  const year = Math.floor(Math.random() * (end - start + 1)) + start;
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ==============================
// HALAMAN UTAMA
// ==============================
export default function MasterGuruPage() {
  const dataGuru: Guru[] = React.useMemo(() => {
    return Array.from({ length: 20 }, (_, idx) => {
      const isMale = idx % 2 === 0;
      const nama = guruNames[idx % guruNames.length];
      const jk: "L" | "P" = isMale ? "L" : "P";

      return {
        no: idx + 1,
        nama,
        nuptk: `4162${String(300000000000 + idx).slice(0, 12)}`,
        jk,
        tempatLahir: randomPick(tempatLahirList),
        tanggalLahir: randomDate(1975, 1995),
        nik: `360301${String(700000000000 + idx).slice(0, 10)}`,
        nip: idx % 3 === 0 ? "-" : `19790${idx} 200501 1 00${idx % 9}`,
        jenisPTK: randomPick(jenisPTKList),
        gelar: jk === "L" ? "S.Pd" : "M.Pd",
        jenjang: randomPick(jenjangList),
        prodi: randomPick(prodiList),
        sertifikasi: randomPick(sertifikasiList),
        tmtKerja: randomDate(2008, 2019),
        tugasTambahan: randomPick(tugasTambahanList),
        mengajar: Array.from({ length: (idx % 3) + 1 }, () => randomPick(mapelList)),
        kompetensi: randomPick(mapelList),
        status: "Aktif",
      };
    });
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);

  // === Modal State ===
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selectedGuru, setSelectedGuru] = React.useState<GuruFormData | null>(null);

  const filteredData = dataGuru.filter((g) => g.nama.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* === TOMBOL TAMBAH === */}
            <Button
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
              onClick={() => {
                setModalMode("add");
                setSelectedGuru(null);
                setModalOpen(true);
              }}
            >
              <UserPlus className="w-4 h-4" />
              Tambah Guru
            </Button>

            <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              <Upload className="w-4 h-4" /> Import
            </Button>

            <Button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white cursor-pointer">
              <Download className="w-4 h-4" /> Export
            </Button>

            <Button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-gray-700" />
              Unduh Template
            </Button>
          </div>
        </div>

        {/* Title + Filter */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Data Guru</h1>

          <div className="flex items-center gap-3">
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(val) => {
                setRowsPerPage(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="10" />
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

      {/* TABEL */}
      <div className="rounded border border-gray-200 shadow-sm bg-white">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[2000px] text-sm text-left">
            <thead className="bg-sky-100 text-gray-700 h-14">
              <tr>
                <th className="p-3 whitespace-nowrap">No</th>
                <th className="p-3 whitespace-nowrap">Nama</th>
                <th className="p-3 whitespace-nowrap">NUPTK</th>
                <th className="p-3 whitespace-nowrap">JK</th>
                <th className="p-3 whitespace-nowrap">Tempat Lahir</th>
                <th className="p-3 whitespace-nowrap">Tanggal Lahir</th>
                <th className="p-3 whitespace-nowrap">NIK</th>
                <th className="p-3 whitespace-nowrap">NIP</th>
                <th className="p-3 whitespace-nowrap">Jenis PTK</th>
                <th className="p-3 whitespace-nowrap">Gelar</th>
                <th className="p-3 whitespace-nowrap">Jenjang</th>
                <th className="p-3 whitespace-nowrap">Jurusan/Prodi</th>
                <th className="p-3 whitespace-nowrap">Sertifikasi</th>
                <th className="p-3 whitespace-nowrap">TMT Kerja</th>
                <th className="p-3 whitespace-nowrap">Tugas Tambahan</th>
                <th className="p-3 whitespace-nowrap">Mengajar</th>
                <th className="p-3 whitespace-nowrap">Kompetensi</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((g) => (
                <tr key={g.no} className="border-b last:border-none hover:bg-sky-50 transition-colors">
                  <td className="p-3 whitespace-nowrap">{g.no}</td>
                  <td className="p-3 whitespace-nowrap font-medium">{g.nama}</td>
                  <td className="p-3 whitespace-nowrap">{g.nuptk}</td>
                  <td className="p-3 whitespace-nowrap">{g.jk}</td>
                  <td className="p-3 whitespace-nowrap">{g.tempatLahir}</td>
                  <td className="p-3 whitespace-nowrap">{g.tanggalLahir}</td>
                  <td className="p-3 whitespace-nowrap">{g.nik}</td>
                  <td className="p-3 whitespace-nowrap">{g.nip}</td>
                  <td className="p-3 whitespace-nowrap">{g.jenisPTK}</td>
                  <td className="p-3 whitespace-nowrap">{g.gelar}</td>
                  <td className="p-3 whitespace-nowrap">{g.jenjang}</td>
                  <td className="p-3 whitespace-nowrap">{g.prodi}</td>
                  <td className="p-3 whitespace-nowrap">{g.sertifikasi}</td>
                  <td className="p-3 whitespace-nowrap">{g.tmtKerja}</td>
                  <td className="p-3 whitespace-nowrap">{g.tugasTambahan}</td>
                  <td className="p-3 whitespace-nowrap">{g.mengajar.join(", ")}</td>
                  <td className="p-3 whitespace-nowrap">{g.kompetensi}</td>
                  <td className="p-3 whitespace-nowrap">{g.status}</td>

                  <td className="p-3 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs rounded-md transition">
                        {" "}
                        <Eye className="w-4 h-4" /> Detail{" "}
                      </button>

                      {/* EDIT */}
                      <button
                        className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-md transition"
                        onClick={() => {
                          setModalMode("edit");
                          setSelectedGuru({
                            id: g.nuptk,
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
                            tugasTambahan: g.tugasTambahan,
                            mengajar: g.mengajar,
                            kompetensi: g.kompetensi,
                            status: g.status,
                          });
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      {/* HAPUS */}
                      <button className="flex items-center gap-1.5 px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs rounded-md transition">
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

        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* MODAL */}
      <GuruModal
        open={isModalOpen}
        mode={modalMode}
        initialData={selectedGuru || undefined}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          console.log("DATA GURU:", data);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
