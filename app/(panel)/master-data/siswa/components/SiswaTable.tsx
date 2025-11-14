"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { SiswaRow } from "../page";

interface Props {
  data: (SiswaRow & { no: number })[];
  loading: boolean;
  onEdit: (s: SiswaRow) => void;
  onDelete: (id: number) => void;
  onDetail?: (s: SiswaRow) => void;
}

export default function SiswaTable({ data, loading, onEdit, onDelete, onDetail }: Props) {
  return (
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
            {loading ? (
              <tr>
                <td colSpan={23} className="p-4 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={23} className="p-4 text-center text-gray-500">
                  Tidak ada data siswa.
                </td>
              </tr>
            ) : (
              data.map((s) => (
                <tr key={s.id} className="border-b last:border-none hover:bg-sky-50 transition-colors">
                  <td className="p-3 whitespace-nowrap">{s.no}</td>
                  <td className="p-3 whitespace-nowrap font-medium">{s.nama}</td>
                  <td className="p-3 whitespace-nowrap">{s.nipd}</td>
                  <td className="p-3 whitespace-nowrap">{s.jk}</td>
                  <td className="p-3 whitespace-nowrap">{s.nisn}</td>
                  <td className="p-3 whitespace-nowrap">{s.tempat_lahir}</td>
                  <td className="p-3 whitespace-nowrap">{s.tanggal_lahir}</td>
                  <td className="p-3 whitespace-nowrap">{s.nik}</td>
                  <td className="p-3 whitespace-nowrap">{s.agama}</td>
                  <td className="p-3 whitespace-nowrap">{s.alamat}</td>
                  <td className="p-3 whitespace-nowrap">{s.rt}</td>
                  <td className="p-3 whitespace-nowrap">{s.rw}</td>
                  <td className="p-3 whitespace-nowrap">{s.kelurahan}</td>
                  <td className="p-3 whitespace-nowrap">{s.kecamatan}</td>
                  <td className="p-3 whitespace-nowrap">{s.kode_pos}</td>

                  {/* ======== JOIN RESULT ======== */}
                  <td className="p-3 whitespace-nowrap">{s.kelas?.nama_rombel ?? "-"}</td>

                  {/* ======= INI BAGIAN UPDATE ======= */}
                  <td className="p-3 whitespace-nowrap">{s.jurusan?.kode ?? "-"}</td>

                  <td className="p-3 whitespace-nowrap">{s.tahun_masuk}</td>
                  <td className="p-3 whitespace-nowrap">{s.semester}</td>
                  <td className="p-3 whitespace-nowrap">{s.status}</td>
                  <td className="p-3 whitespace-nowrap">{s.hp}</td>
                  <td className="p-3 whitespace-nowrap">{s.email}</td>

                  <td className="p-3 whitespace-nowrap text-center">
                    <div className="flex justify-center items-center gap-2">
                      {onDetail && (
                        <button className="px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs rounded-md flex items-center gap-1.5" onClick={() => onDetail(s)}>
                          <Eye className="w-4 h-4" />
                          Detail
                        </button>
                      )}

                      <button className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-md flex items-center gap-1.5" onClick={() => onEdit(s)}>
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button className="px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs rounded-md flex items-center gap-1.5" onClick={() => onDelete(s.id)}>
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
  );
}
