"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import MataPelajaranModal, { MapelFormData } from "./components/MataPelajaranModal";
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";

type SupabaseMapel = {
  id: number;
  kode_mapel: string;
  nama: string;
  kategori: "NORMATIF" | "ADAPTIF" | "PRODUKTIF" | "MUATAN_LOKAL" | "LAINNYA";
  tingkat: number;
  jp_per_minggu: number;
  status: "ACTIVE" | "INACTIVE";
  warna_hex: string;
};

type MataPelajaran = {
  no: number;
  kode: string;
  nama: string;
  kategori: SupabaseMapel["kategori"];
  tingkat: "X" | "XI" | "XII";
  jp: number;
  warna: string;
  status: "Aktif" | "Tidak Aktif";
};

export default function MasterMapelPage() {
  const supabase = createClientComponentClient();
  const [dataMapel, setDataMapel] = React.useState<MataPelajaran[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [isModalOpen, setModalOpen] = React.useState<boolean>(false);
  const [selectedMapel, setSelectedMapel] = React.useState<MapelFormData | null>(null);
  const [page, setPage] = React.useState<number>(1);
  const rowsPerPage = 10;

  const loadMapel = React.useCallback(async () => {
    setLoading(true);

    const { data } = await supabase.from("mata_pelajaran").select("id, kode_mapel, nama, kategori, tingkat, jp_per_minggu, status, warna_hex").order("id", { ascending: true });

    const rows: SupabaseMapel[] = data ?? [];

    setDataMapel(
      rows.map((m) => ({
        no: m.id,
        kode: m.kode_mapel,
        nama: m.nama,
        kategori: m.kategori,
        tingkat: m.tingkat === 10 ? "X" : m.tingkat === 11 ? "XI" : "XII",
        jp: m.jp_per_minggu,
        warna: m.warna_hex,
        status: m.status === "ACTIVE" ? "Aktif" : "Tidak Aktif",
      }))
    );

    setLoading(false);
  }, [supabase]);

  React.useEffect(() => {
    loadMapel();
  }, [loadMapel]);

  const filtered = dataMapel.filter((m) => m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || m.kode.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;

  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  const handleSave = async (data: MapelFormData) => {
    // PERBAIKAN DILAKUKAN DI SINI: Mengubah perbandingan angka (11) menjadi string ("XI")
    const tingkatValue = data.tingkat === "X" ? 10 : data.tingkat === "XI" ? 11 : 12;

    const statusDb = data.status === "Aktif" ? "ACTIVE" : "INACTIVE";

    if (selectedMapel) {
      await supabase
        .from("mata_pelajaran")
        .update({
          kode_mapel: data.kode,
          nama: data.nama,
          kategori: data.kategori,
          tingkat: tingkatValue,
          jp_per_minggu: data.jp,
          warna_hex: data.warna,
          status: statusDb,
        })
        .eq("id", selectedMapel.id);
    } else {
      await supabase.from("mata_pelajaran").insert({
        kode_mapel: data.kode,
        nama: data.nama,
        kategori: data.kategori,
        tingkat: tingkatValue,
        jp_per_minggu: data.jp,
        warna_hex: data.warna,
        status: statusDb,
      });
    }

    setModalOpen(false);
    setSelectedMapel(null);
    loadMapel();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("mata_pelajaran").delete().eq("id", id).select("*");

    if (error) {
      alert("Tidak bisa menghapus karena data sedang digunakan.");
      console.log(error);
      return;
    }

    loadMapel();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Data Mata Pelajaran</h1>

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

          <Button className="flex items-center gap-2 bg-sky-600 text-white" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Tambah
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-sky-100">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Kode</th>
                <th className="p-3">Nama</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Tingkat</th>
                <th className="p-3">JP</th>
                <th className="p-3">Kode Warna</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              )}

              {!loading &&
                paginated.map((m, i) => (
                  <tr key={m.no} className="border-b hover:bg-sky-50">
                    <td className="p-3">{startIndex + i + 1}</td>
                    <td className="p-3">{m.kode}</td>
                    <td className="p-3">{m.nama}</td>
                    <td className="p-3">{m.kategori}</td>
                    <td className="p-3">{m.tingkat}</td>
                    <td className="p-3">{m.jp}</td>

                    <td className="p-3">
                      <span className="px-3 py-1 rounded text-xs border" style={{ background: m.warna }}>
                        {m.warna}
                      </span>
                    </td>

                    <td className="p-3">{m.status}</td>

                    <td className="p-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="px-3 py-2 bg-amber-500 text-white text-xs rounded-md flex items-center gap-1"
                          onClick={() => {
                            setSelectedMapel({
                              id: m.no,
                              kode: m.kode,
                              nama: m.nama,
                              kategori: m.kategori,
                              tingkat: m.tingkat,
                              jp: m.jp,
                              warna: m.warna,
                              status: m.status,
                            });
                            setModalOpen(true);
                          }}
                        >
                          <Pencil className="w-4 h-4" /> Edit
                        </button>

                        <button className="px-3 py-2 bg-rose-500 text-white text-xs rounded-md flex items-center gap-1" onClick={() => handleDelete(m.no)}>
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

      {/* Pagination */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <span className="text-sm">
          {page} dari {totalPages || 1}
        </span>

        <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Modal */}
      <MataPelajaranModal
        open={isModalOpen}
        mode={selectedMapel ? "edit" : "add"}
        initialData={selectedMapel || undefined}
        onClose={() => {
          setModalOpen(false);
          setSelectedMapel(null);
        }}
        onSubmit={handleSave}
      />
    </div>
  );
}
