"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, UserPlus, Upload, Download, FileSpreadsheet, Eye, Pencil, Trash2 } from "lucide-react";

type Siswa = {
  no: number;
  nama: string;
  nipd: string;
  jk: "L" | "P";
  nisn: string;
  tempatLahir: string;
  tanggalLahir: string;
  nik: string;
  agama: "Islam" | "Kristen" | "Katolik" | "Hindu" | "Budha" | "Konghucu";
  alamat: string; // sudah termasuk dusun
  rt: string;
  rw: string;
  kelurahan: "Balaraja" | "Cangkudu" | "Gembong" | "Saga" | "Sentul" | "Sentul Jaya" | "Suka Murni" | "Talagasari" | "Tobat";
  kecamatan: "Balaraja";
  kodePos: "15610";
  hp: string;
  email: string;

  // === tambahan data sekolah ===
  kelas: string;
  jurusan: "RPL" | "TKJ" | "AKL" | "TBSM" | "OTKP";
  tahunMasuk: number;
  semester: number;
  status: "Aktif" | "Lulus" | "Pindah" | "Nonaktif";
};

// --- Helpers untuk membuat data realistis ---

const KODE_WILAYAH_NIK = "360301";

function pad(n: number, len: number) {
  return n.toString().padStart(len, "0");
}

function makeNIK(tgl: string, jk: "L" | "P", serial: number): string {
  const [y, m, d] = tgl.split("-").map((v) => parseInt(v, 10));
  const day = jk === "P" ? d + 40 : d;
  const ddmmyy = `${pad(day, 2)}${pad(m, 2)}${pad(y % 100, 2)}`;
  return `${KODE_WILAYAH_NIK}${ddmmyy}${pad(serial, 4)}`;
}

function makeNIPD(urut: number, tahunMasuk = 24, kodeSekolah = 555) {
  return `${pad(tahunMasuk, 2)}-${kodeSekolah}-${pad(urut, 4)}`;
}

function makeNISN(seed: number) {
  return `10${pad(300000000 + seed, 9).slice(0, 9)}`;
}

function makeHP(seed: number) {
  const prefixes = ["0812", "0813", "0821", "0857", "0881"];
  const pref = prefixes[seed % prefixes.length];
  const tail = pad(10000000 + ((seed * 317) % 90000000), 8);
  return `${pref}${tail}`;
}

function makeEmail(nama: string, seed: number) {
  const base = nama.toLowerCase().replace(/[^a-z0-9]+/g, ".");
  const doms = ["smkbadar.sch.id", "student.sch.id", "mail.com"];
  return `${base}.${200 + seed}@${doms[seed % doms.length]}`;
}

function rr(n: number) {
  return pad((n % 20) + 1, 2);
}

const kelurahans: Siswa["kelurahan"][] = ["Balaraja", "Cangkudu", "Gembong", "Saga", "Sentul", "Sentul Jaya", "Suka Murni", "Talagasari", "Tobat"];
const laki = ["Ahmad Rizky", "Bagas Pratama", "Dimas Aditya", "Rizal Maulana", "Fajar Setiawan", "Rafi Hidayat", "Ardiansyah Putra", "Bayu Saputra", "Ilham Ramadhan", "Yoga Prasetyo"];
const perempuan = ["Aulia Rahma", "Dewi Lestari", "Siti Nuraini", "Nabila Putri", "Mega Oktaviani", "Laras Sari", "Indah Permata", "Fitri Handayani", "Anisa Maharani", "Rina Kusuma"];
const tempatLahirList = ["Tangerang", "Jakarta", "Serang", "Bekasi", "Bogor", "Depok", "Bandung"];
const agamaList: Siswa["agama"][] = ["Islam", "Kristen", "Katolik", "Hindu", "Budha", "Konghucu"];
const dusunList = ["Kp. Cariu", "Kp. Gembong", "Kp. Saga", "Kp. Sentul", "Kp. Tobat", "Perum Puri Balaraja Blok B", "Perum Taman Balaraja Blok C", "Perum Talagasari Blok A", "Kp. Suka Murni", "Perum Sentul Jaya Blok F"];
const jalanList = ["Jl. Raya Serang KM 24", "Jl. Raya Balaraja", "Jl. Talagasari Indah", "Jl. Sentul Jaya", "Jl. Cangkudu Utama", "Jl. Gembong Satu", "Jl. Tobat Hijau", "Jl. Saga Mandiri"];
const jurusanList: Siswa["jurusan"][] = ["RPL", "TKJ", "AKL", "TBSM", "OTKP"];

export const dataSiswa: Siswa[] = Array.from({ length: 20 }, (_, idx) => {
  const isMale = idx % 2 === 0;
  const nama = (isMale ? laki : perempuan)[idx % 10];
  const jk: "L" | "P" = isMale ? "L" : "P";

  const years = [2006, 2007, 2008];
  const y = years[idx % years.length];
  const m = (idx % 12) + 1;
  const d = (idx % 27) + 1;
  const tanggalLahir = `${y}-${pad(m, 2)}-${pad(d, 2)}`;

  const kelurahan = kelurahans[idx % kelurahans.length];
  const dusun = dusunList[idx % dusunList.length];
  const jalan = jalanList[idx % jalanList.length];
  const alamat = `${dusun}, ${jalan} No.${(idx % 120) + 3}`;

  const jurusan = jurusanList[idx % jurusanList.length];
  const kelas = `XI ${jurusan} ${(idx % 3) + 1}`;
  const tahunMasuk = 2024;
  const semester = (idx % 2) + 1;
  const status: Siswa["status"] = "Aktif";

  return {
    no: idx + 1,
    nama,
    nipd: makeNIPD(idx + 1, 24, 555),
    jk,
    nisn: makeNISN(idx + 1),
    tempatLahir: tempatLahirList[idx % tempatLahirList.length],
    tanggalLahir,
    nik: makeNIK(tanggalLahir, jk, 1001 + idx),
    agama: agamaList[idx % agamaList.length],
    alamat,
    rt: rr(idx + 3),
    rw: rr(idx + 7),
    kelurahan,
    kecamatan: "Balaraja",
    kodePos: "15610",
    hp: makeHP(idx + 1),
    email: makeEmail(nama, idx + 1),

    // tambahan sekolah
    kelas,
    jurusan,
    tahunMasuk,
    semester,
    status,
  };
});

export default function MasterSiswaPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(1);

  const filteredData = dataSiswa.filter((s) => s.nama.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="w-full space-y-6">
      {/* HEADER FILTER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white cursor-pointer">
              <UserPlus className="w-4 h-4" />
              Tambah Siswa
            </Button>
            <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white cursor-pointer">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-gray-700" />
              Unduh Template
            </Button>
          </div>
        </div>

        {/* Judul + filter */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-800">Data Siswa</h1>
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
          <table className="w-full min-w-[1900px] text-sm text-left border-collapse">
            <thead className="bg-sky-100 text-[15px] text-gray-700 h-14">
              <tr>
                <th className="p-3 whitespace-nowrap">No</th>
                <th className="p-3 whitespace-nowrap">Nama</th>
                <th className="p-3 whitespace-nowrap">NIPD</th>
                <th className="p-3 whitespace-nowrap">JK</th>
                <th className="p-3 whitespace-nowrap">NISN</th>
                <th className="p-3 whitespace-nowrap">Tempat Lahir</th>
                <th className="p-3 whitespace-nowrap">Tanggal Lahir</th>
                <th className="p-3 whitespace-nowrap">NIK</th>
                <th className="p-3 whitespace-nowrap">Agama</th>
                <th className="p-3 whitespace-nowrap">Alamat</th>
                <th className="p-3 whitespace-nowrap">RT</th>
                <th className="p-3 whitespace-nowrap">RW</th>
                <th className="p-3 whitespace-nowrap">Kelurahan</th>
                <th className="p-3 whitespace-nowrap">Kecamatan</th>
                <th className="p-3 whitespace-nowrap">Kode Pos</th>
                <th className="p-3 whitespace-nowrap">Kelas</th>
                <th className="p-3 whitespace-nowrap">Jurusan</th>
                <th className="p-3 whitespace-nowrap">Tahun Masuk</th>
                <th className="p-3 whitespace-nowrap">Semester</th>
                <th className="p-3 whitespace-nowrap">Status</th>
                <th className="p-3 whitespace-nowrap">HP</th>
                <th className="p-3 whitespace-nowrap">Email</th>
                <th className="p-3 whitespace-nowrap text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {paginatedData.map((s) => (
                <tr key={s.no} className="border-b last:border-none hover:bg-sky-50 transition-colors">
                  <td className="p-3 whitespace-nowrap">{s.no}</td>
                  <td className="p-3 whitespace-nowrap font-medium">{s.nama}</td>
                  <td className="p-3 whitespace-nowrap">{s.nipd}</td>
                  <td className="p-3 whitespace-nowrap">{s.jk}</td>
                  <td className="p-3 whitespace-nowrap">{s.nisn}</td>
                  <td className="p-3 whitespace-nowrap">{s.tempatLahir}</td>
                  <td className="p-3 whitespace-nowrap">{s.tanggalLahir}</td>
                  <td className="p-3 whitespace-nowrap">{s.nik}</td>
                  <td className="p-3 whitespace-nowrap">{s.agama}</td>
                  <td className="p-3 whitespace-nowrap">{s.alamat}</td>
                  <td className="p-3 whitespace-nowrap">{s.rt}</td>
                  <td className="p-3 whitespace-nowrap">{s.rw}</td>
                  <td className="p-3 whitespace-nowrap">{s.kelurahan}</td>
                  <td className="p-3 whitespace-nowrap">{s.kecamatan}</td>
                  <td className="p-3 whitespace-nowrap">{s.kodePos}</td>
                  <td className="p-3 whitespace-nowrap">{s.kelas}</td>
                  <td className="p-3 whitespace-nowrap">{s.jurusan}</td>
                  <td className="p-3 whitespace-nowrap">{s.tahunMasuk}</td>
                  <td className="p-3 whitespace-nowrap">{s.semester}</td>
                  <td className="p-3 whitespace-nowrap">{s.status}</td>
                  <td className="p-3 whitespace-nowrap">{s.hp}</td>
                  <td className="p-3 whitespace-nowrap">{s.email}</td>

                  {/* Tombol Aksi */}
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
