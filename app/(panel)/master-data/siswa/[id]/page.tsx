"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { User, Pencil, Trash2, Download, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import SiswaModal, { SiswaFormData } from "../components/SiswaModal";
import ConfirmDeleteModal from "@/app/components/ConfirmDeleteModal";
import SuccessDeleteModal from "@/app/components/SuccessDeleteModal";
import SuccessSaveModal from "@/app/components/SuccessSaveModal";

// ========================
// TYPE DETAIL
// ========================
interface SiswaDetail {
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
  kelas: { nama_rombel: string } | null;

  jurusan_id: number | null;
  jurusan: { kode: string } | null;

  tahun_masuk: number | null;
  semester: number | null;
  status: string;
  hp: string | null;
  email: string | null;
}

// ========================
// PAGE
// ========================
export default function DetailSiswaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [siswa, setSiswa] = useState<SiswaDetail | null>(null);

  // modals
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openSuccessSave, setOpenSuccessSave] = useState(false);
  const [openSuccessDelete, setOpenSuccessDelete] = useState(false);

  // ================
  // FETCH DETAIL
  // ================
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("siswa")
        .select(
          `
            *,
            kelas:kelas_id ( nama_rombel ),
            jurusan:jurusan_id ( kode )
          `
        )
        .eq("id", id)
        .single();

      if (!error && data) {
        setSiswa(data as SiswaDetail);
      }

      setLoading(false);
    };

    load();
  }, [id]);

  // ================
  // HANDLE SAVE (EDIT)
  // ================
  const handleSave = async (form: SiswaFormData) => {
    const payload = {
      nama: form.nama || null,
      nipd: form.nipd || null,
      nisn: form.nisn || null,
      jk: form.jk,

      tempat_lahir: form.tempatLahir || null,
      tanggal_lahir: form.tanggalLahir || null,
      nik: form.nik || null,
      agama: form.agama.toUpperCase(),
      alamat: form.alamat || null,
      rt: form.rt || null,
      rw: form.rw || null,
      kelurahan: form.kelurahan || null,
      kecamatan: form.kecamatan || null,
      kode_pos: form.kodePos || null,

      kelas_id: form.kelasId ? Number(form.kelasId) : null,
      jurusan_id: form.jurusanId ? Number(form.jurusanId) : null,
      tahun_masuk: form.tahunMasuk ? Number(form.tahunMasuk) : null,
      semester: form.semester ? Number(form.semester) : null,
      status: form.status.toUpperCase(),

      hp: form.hp || null,
      email: form.email || null,
    };

    await supabase.from("siswa").update(payload).eq("id", id);

    setOpenEdit(false);
    setOpenSuccessSave(true);

    // reload detail
    const { data } = await supabase
      .from("siswa")
      .select(
        `
        *,
        kelas:kelas_id ( nama_rombel ),
        jurusan:jurusan_id ( kode )
      `
      )
      .eq("id", id)
      .single();

    if (data) setSiswa(data as SiswaDetail);
  };

  // ================
  // HANDLE DELETE
  // ================
  const handleDelete = async () => {
    await supabase.from("siswa").delete().eq("id", id);

    setOpenConfirmDelete(false);
    setOpenSuccessDelete(true);

    setTimeout(() => {
      router.push("/master-data/siswa");
    }, 800);
  };

  if (loading) return <div className="p-6">Memuat data...</div>;
  if (!siswa) return <div className="p-6 text-red-600">Data siswa tidak ditemukan.</div>;

  // Convert siswa => SiswaFormData
  const formData: SiswaFormData = {
    id: siswa.id.toString(),
    nama: siswa.nama,
    nipd: siswa.nipd ?? "",
    nisn: siswa.nisn ?? "",
    jk: siswa.jk,
    tempatLahir: siswa.tempat_lahir ?? "",
    tanggalLahir: siswa.tanggal_lahir ?? "",
    nik: siswa.nik ?? "",
    agama: siswa.agama ?? "ISLAM",
    alamat: siswa.alamat ?? "",
    rt: siswa.rt ?? "",
    rw: siswa.rw ?? "",
    kelurahan: siswa.kelurahan ?? "",
    kecamatan: siswa.kecamatan ?? "",
    kodePos: siswa.kode_pos ?? "",
    kelasId: siswa.kelas_id?.toString() ?? "",
    jurusanId: siswa.jurusan_id?.toString() ?? "",
    tahunMasuk: siswa.tahun_masuk ?? "",
    semester: siswa.semester ?? "",
    status: siswa.status,
    hp: siswa.hp ?? "",
    email: siswa.email ?? "",
  };

  return (
    <div className="w-full p-6 space-y-6">
      <button onClick={() => window.history.back()} className="mb-4 bg-gray-100 px-3 py-1 flex rounded items-center text-gray-700 hover:bg-gray-200">
        <ArrowLeft className="w-5 h-5" /> Kembali
      </button>
      {/* HEADER: FOTO + NAMA + BUTTON DOWNLOAD */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* ICON USER (sementara sebelum foto profile) */}
          <div className="w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center">
            <User className="w-8 h-8 text-sky-600" />
          </div>

          {/* NAMA SISWA DI SAMPING FOTO */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{siswa.nama}</h1>
            <p className="text-gray-500 text-sm">NISN: {siswa.nisn ?? "-"}</p>
          </div>
        </div>

        {/* BUTTON DOWNLOAD */}
        <Button className="bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-2">
          <Download className="w-4 h-4" />
          Unduh Data Siswa
        </Button>
      </div>

      {/* DETAIL GRID */}
      <div className="grid grid-cols-2 gap-4 p-4 border rounded bg-white">
        <DetailItem label="NIPD" value={siswa.nipd} />
        <DetailItem label="NISN" value={siswa.nisn} />

        <DetailItem label="Jenis Kelamin" value={siswa.jk} />
        <DetailItem label="Tempat Lahir" value={siswa.tempat_lahir} />
        <DetailItem label="Tanggal Lahir" value={siswa.tanggal_lahir} />

        <DetailItem label="NIK" value={siswa.nik} />
        <DetailItem label="Agama" value={siswa.agama} />

        <DetailItem label="Alamat" value={siswa.alamat} />
        <DetailItem label="RT" value={siswa.rt} />
        <DetailItem label="RW" value={siswa.rw} />
        <DetailItem label="Kelurahan" value={siswa.kelurahan} />
        <DetailItem label="Kecamatan" value={siswa.kecamatan} />

        <DetailItem label="Kode Pos" value={siswa.kode_pos} />
        <DetailItem label="Kelas" value={siswa.kelas?.nama_rombel ?? "-"} />
        <DetailItem label="Jurusan" value={siswa.jurusan?.kode ?? "-"} />

        <DetailItem label="Tahun Masuk" value={siswa.tahun_masuk} />
        <DetailItem label="Semester" value={siswa.semester} />
        <DetailItem label="Status" value={siswa.status} />
        <DetailItem label="HP" value={siswa.hp} />
        <DetailItem label="Email" value={siswa.email} />
      </div>

      {/* BUTTONS DI KANAN BAWAH */}
      <div className="flex justify-end gap-3 pt-4">
        <Button className="bg-amber-500 text-white flex items-center gap-2" onClick={() => setOpenEdit(true)}>
          <Pencil className="w-4 h-4" />
          Edit
        </Button>

        <Button className="bg-rose-600 text-white flex items-center gap-2" onClick={() => setOpenConfirmDelete(true)}>
          <Trash2 className="w-4 h-4" />
          Hapus
        </Button>
      </div>

      {/* MODALS */}
      <SiswaModal open={openEdit} mode="edit" initialData={formData} onClose={() => setOpenEdit(false)} onSubmit={handleSave} />

      <ConfirmDeleteModal open={openConfirmDelete} onCancel={() => setOpenConfirmDelete(false)} onConfirm={handleDelete} />

      <SuccessSaveModal open={openSuccessSave} onClose={() => setOpenSuccessSave(false)} />

      <SuccessDeleteModal open={openSuccessDelete} onClose={() => setOpenSuccessDelete(false)} />
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-gray-700">{label}</span>
      <span className="text-gray-900">{value || "-"}</span>
    </div>
  );
}
