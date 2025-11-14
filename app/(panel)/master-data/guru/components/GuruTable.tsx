"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

export type GuruTableItem = {
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

interface Props {
  data: GuruTableItem[];
  loading: boolean;
  onEdit: (g: GuruTableItem) => void;
  onDelete: (id: number) => void;
  onDetail?: (g: GuruTableItem) => void;
}

export default function GuruTable({ data, loading, onEdit, onDelete, onDetail }: Props) {
  return (
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
            {loading ? (
              <tr>
                <td colSpan={19} className="p-4 text-center text-sm text-gray-500">
                  Memuat data guru...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={19} className="p-4 text-center text-sm text-gray-500">
                  Tidak ada data guru.
                </td>
              </tr>
            ) : (
              data.map((g) => (
                <tr key={g.id} className="border-b last:border-none hover:bg-sky-50 transition-colors">
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
                      {onDetail && (
                        <button className="flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs rounded-md transition" onClick={() => onDetail(g)}>
                          <Eye className="w-4 h-4" /> Detail
                        </button>
                      )}

                      <button className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-md transition" onClick={() => onEdit(g)}>
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button className="flex items-center gap-1.5 px-3 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs rounded-md transition" onClick={() => onDelete(g.id)}>
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
