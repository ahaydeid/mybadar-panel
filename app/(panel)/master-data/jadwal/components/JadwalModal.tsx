"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Option = { id: number; nama: string };
type GuruOption = { id: number; nama: string };

type JamOption = {
  id: number;
  nama: string;
  jam_mulai: string;
  jam_selesai: string;
};

type SemesterOption = {
  id: number;
  nama: string; // contoh: "Semester Ganjil (2024/2025)"
  tahun_ajaran: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function JadwalModal({ open, onClose }: Props) {
  const [hariList, setHariList] = useState<Option[]>([]);
  const [jamList, setJamList] = useState<JamOption[]>([]);
  const [kelasList, setKelasList] = useState<Option[]>([]);
  const [mapelList, setMapelList] = useState<Option[]>([]);
  const [guruList, setGuruList] = useState<GuruOption[]>([]);
  const [semesterList, setSemesterList] = useState<SemesterOption[]>([]);

  const [form, setForm] = useState({
    hari_id: 0,
    jam_id: 0,
    kelas_id: 0,
    guru_id: 0,
    mapel_id: 0,
    semester_id: 0,
    tahun_ajaran: "",
  });

  // === RESET FORM SETIAP MODAL DIBUKA ===
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setForm({
          hari_id: 0,
          jam_id: 0,
          kelas_id: 0,
          guru_id: 0,
          mapel_id: 0,
          semester_id: 0,
          tahun_ajaran: "",
        });
      }, 0);
    }
  }, [open]);

  // === LOAD DATA DROPDOWN ===
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      const [hari, jam, kelas, mapel, guru, semester] = await Promise.all([
        supabase.from("hari").select("id,nama"),
        supabase.from("jam").select("id,nama,jam_mulai,jam_selesai"),
        supabase.from("kelas").select("id,nama_rombel"),
        supabase.from("mata_pelajaran").select("id,nama"),
        supabase.from("guru").select("id,nama"),
        supabase.from("semester").select("id,nama,tahun_ajaran"),
      ]);

      setHariList(hari.data?.map((x) => ({ id: x.id, nama: x.nama })) ?? []);

      setJamList(
        jam.data?.map((x) => ({
          id: x.id,
          nama: x.nama,
          jam_mulai: x.jam_mulai,
          jam_selesai: x.jam_selesai,
        })) ?? []
      );

      setKelasList(kelas.data?.map((x) => ({ id: x.id, nama: x.nama_rombel })) ?? []);
      setMapelList(mapel.data?.map((x) => ({ id: x.id, nama: x.nama })) ?? []);
      setGuruList(guru.data?.map((x) => ({ id: x.id, nama: x.nama })) ?? []);

      // SET SEMESTER + TAHUN AJARAN GABUNGAN
      setSemesterList(
        semester.data?.map((x) => ({
          id: x.id,
          nama: `${x.nama} (${x.tahun_ajaran})`,
          tahun_ajaran: x.tahun_ajaran,
        })) ?? []
      );
    };

    load();
  }, [open]);

  if (!open) return null;

  // === HANDLE SUBMIT ===
  const submit = async () => {
    if (form.hari_id === 0) return alert("Hari wajib dipilih.");
    if (form.jam_id === 0) return alert("Jam wajib dipilih.");
    if (form.kelas_id === 0) return alert("Kelas wajib dipilih.");
    if (form.mapel_id === 0) return alert("Mapel wajib dipilih.");
    if (form.semester_id === 0) return alert("Semester wajib dipilih.");
    if (!form.tahun_ajaran.trim()) return alert("Tahun ajaran wajib dipilih.");

    await supabase.from("jadwal").insert({
      hari_id: form.hari_id,
      jam_id: form.jam_id,
      kelas_id: form.kelas_id,
      guru_id: form.guru_id === 0 ? null : form.guru_id,
      mapel_id: form.mapel_id,
      semester_id: form.semester_id,
      tahun_ajaran: form.tahun_ajaran,
    });

    onClose();
  };

  // JSX
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl p-6">
        <h2 className="text-xl font-bold mb-4">Tambah Jadwal</h2>

        <div className="space-y-4">
          {/* HARI */}
          <div>
            <label className="font-semibold text-sm">Hari *</label>
            <select className="w-full border rounded px-3 py-2" value={form.hari_id} onChange={(e) => setForm({ ...form, hari_id: Number(e.target.value) })}>
              <option value={0}>Pilih hari</option>
              {hariList.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nama}
                </option>
              ))}
            </select>
          </div>

          {/* JAM */}
          <div>
            <label className="font-semibold text-sm">Jam *</label>
            <select className="w-full border rounded px-3 py-2" value={form.jam_id} onChange={(e) => setForm({ ...form, jam_id: Number(e.target.value) })}>
              <option value={0}>Pilih jam</option>
              {jamList.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nama} ({j.jam_mulai} - {j.jam_selesai})
                </option>
              ))}
            </select>
          </div>

          {/* KELAS */}
          <div>
            <label className="font-semibold text-sm">Kelas *</label>
            <select className="w-full border rounded px-3 py-2" value={form.kelas_id} onChange={(e) => setForm({ ...form, kelas_id: Number(e.target.value) })}>
              <option value={0}>Pilih kelas</option>
              {kelasList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          {/* MAPEL */}
          <div>
            <label className="font-semibold text-sm">Mapel *</label>
            <select className="w-full border rounded px-3 py-2" value={form.mapel_id} onChange={(e) => setForm({ ...form, mapel_id: Number(e.target.value) })}>
              <option value={0}>Pilih mapel</option>
              {mapelList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama}
                </option>
              ))}
            </select>
          </div>

          {/* GURU */}
          <div>
            <label className="font-semibold text-sm">Guru</label>
            <select className="w-full border rounded px-3 py-2" value={form.guru_id} onChange={(e) => setForm({ ...form, guru_id: Number(e.target.value) })}>
              <option value={0}>Tidak ada guru</option>
              {guruList.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nama}
                </option>
              ))}
            </select>
          </div>

          {/* SEMESTER + TAHUN AJARAN */}
          <div>
            <label className="font-semibold text-sm">Semester *</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.semester_id}
              onChange={(e) => {
                const id = Number(e.target.value);
                const selected = semesterList.find((s) => s.id === id);
                setForm({
                  ...form,
                  semester_id: id,
                  tahun_ajaran: selected?.tahun_ajaran ?? "",
                });
              }}
            >
              <option value={0}>Pilih semester</option>
              {semesterList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end mt-6 gap-3">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button className="bg-sky-600 text-white" onClick={submit}>
            Simpan
          </Button>
        </div>
      </div>
    </div>
  );
}
