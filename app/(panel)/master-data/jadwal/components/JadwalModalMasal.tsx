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

interface Props {
  open: boolean;
  onClose: () => void;
}

type RowInput = {
  jam_id: number;
  mapel_id: number;
  guru_id: number;
};

type CardInput = {
  hari_id: number;
  rows: RowInput[];
};

export default function JadwalModalMasal({ open, onClose }: Props) {
  const [kelasList, setKelasList] = useState<Option[]>([]);
  const [semesterList, setSemesterList] = useState<(Option & { tahun_ajaran: string })[]>([]);
  const [hariList, setHariList] = useState<Option[]>([]);
  const [jamList, setJamList] = useState<JamOption[]>([]);
  const [mapelList, setMapelList] = useState<Option[]>([]);
  const [guruList, setGuruList] = useState<GuruOption[]>([]);

  const [kelasId, setKelasId] = useState(0);
  const [semesterId, setSemesterId] = useState(0);
  const [tahunAjaran, setTahunAjaran] = useState("");

  const [cards, setCards] = useState<CardInput[]>([{ hari_id: 0, rows: [{ jam_id: 0, mapel_id: 0, guru_id: 0 }] }]);

  // RESET saat modal dibuka
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setKelasId(0);
        setSemesterId(0);
        setTahunAjaran("");
        setCards([{ hari_id: 0, rows: [{ jam_id: 0, mapel_id: 0, guru_id: 0 }] }]);
      }, 0);
    }
  }, [open]);

  // LOAD DATA DROPDOWN
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      const [kelas, semester, hari, jam, mapel, guru] = await Promise.all([
        supabase.from("kelas").select("id,nama_rombel"),
        supabase.from("semester").select("id,nama,tahun_ajaran"),
        supabase.from("hari").select("id,nama"),
        supabase.from("jam").select("id,nama,jam_mulai,jam_selesai"),
        supabase.from("mata_pelajaran").select("id,nama"),
        supabase.from("guru").select("id,nama"),
      ]);

      setKelasList(kelas.data?.map((x) => ({ id: x.id, nama: x.nama_rombel })) ?? []);
      setSemesterList(semester.data?.map((x) => ({ id: x.id, nama: x.nama, tahun_ajaran: x.tahun_ajaran })) ?? []);
      setHariList(hari.data?.map((x) => ({ id: x.id, nama: x.nama })) ?? []);

      setJamList(
        jam.data?.map((x) => ({
          id: x.id,
          nama: x.nama,
          jam_mulai: x.jam_mulai,
          jam_selesai: x.jam_selesai,
        })) ?? []
      );

      setMapelList(mapel.data?.map((x) => ({ id: x.id, nama: x.nama })) ?? []);
      setGuruList(guru.data?.map((x) => ({ id: x.id, nama: x.nama })) ?? []);
    };

    load();
  }, [open]);

  // Update tahun ajaran otomatis dari semester
  useEffect(() => {
    const found = semesterList.find((s) => s.id === semesterId);
    if (found) {
      queueMicrotask(() => {
        setTahunAjaran(found.tahun_ajaran);
      });
    }
  }, [semesterId, semesterList]);

  if (!open) return null;

  // HANDLE SAVE
  const submit = async () => {
    if (kelasId === 0) return alert("Kelas wajib dipilih.");
    if (semesterId === 0) return alert("Semester wajib dipilih.");

    for (const card of cards) {
      if (card.hari_id === 0) return alert("Semua card harus memiliki hari.");

      for (const row of card.rows) {
        if (row.jam_id === 0) return alert("Semua jam harus dipilih.");
        if (row.mapel_id === 0) return alert("Semua mapel harus dipilih.");
        if (row.guru_id === 0) return alert("Semua guru harus dipilih.");
      }
    }

    const payload = cards.flatMap((card) =>
      card.rows.map((row) => ({
        hari_id: card.hari_id,
        jam_id: row.jam_id,
        mapel_id: row.mapel_id,
        kelas_id: kelasId,
        guru_id: row.guru_id,
        semester_id: semesterId,
        tahun_ajaran: tahunAjaran,
      }))
    );

    await supabase.from("jadwal").insert(payload);
    onClose();
  };

  // Tambah card hari (maksimal 7)
  const addCard = () => {
    if (cards.length >= 7) {
      return alert("Maksimal 7 hari.");
    }

    setCards([...cards, { hari_id: 0, rows: [{ jam_id: 0, mapel_id: 0, guru_id: 0 }] }]);
  };

  // Tambah row jam + mapel + guru
  const addRow = (index: number) => {
    const copy = [...cards];
    copy[index].rows.push({ jam_id: 0, mapel_id: 0, guru_id: 0 });
    setCards(copy);
  };

  // Hapus card hari
  const removeCard = (index: number) => {
    if (cards.length === 1) return alert("Minimal 1 card diperlukan.");
    const copy = [...cards];
    copy.splice(index, 1);
    setCards(copy);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto">
      <div className="bg-white w-full h-full overflow-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Tambah Jadwal Masal</h2>

        {/* KELAS & SEMESTER */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-semibold">Pilih Kelas *</label>
            <select className="w-full border rounded px-3 py-2" value={kelasId} onChange={(e) => setKelasId(Number(e.target.value))}>
              <option value={0}>Pilih Kelas</option>
              {kelasList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">Pilih Semester *</label>
            <select className="w-full border rounded px-3 py-2" value={semesterId} onChange={(e) => setSemesterId(Number(e.target.value))}>
              <option value={0}>Pilih Semester</option>
              {semesterList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.tahun_ajaran})
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr className="my-4" />

        {/* CARD LIST — 3 PER BARIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, cardIndex) => (
            <div key={cardIndex} className="border rounded p-4 bg-gray-50 relative">
              <button className="absolute top-2 right-2 text-red-500" onClick={() => removeCard(cardIndex)}>
                ✕
              </button>

              {/* HARI */}
              <select
                className="w-full border text-lg font-bold rounded px-3 py-2 mb-3"
                value={card.hari_id}
                onChange={(e) => {
                  const copy = [...cards];
                  copy[cardIndex].hari_id = Number(e.target.value);
                  setCards(copy);
                }}
              >
                <option value={0}>Pilih Hari</option>
                {hariList.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nama}
                  </option>
                ))}
              </select>

              {/* ROW INPUTS */}
              {card.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-3 gap-3 mb-3">
                  {/* JAM */}
                  <select
                    className="border rounded px-3 py-2"
                    value={row.jam_id}
                    onChange={(e) => {
                      const copy = [...cards];
                      copy[cardIndex].rows[rowIndex].jam_id = Number(e.target.value);
                      setCards(copy);
                    }}
                  >
                    <option value={0}>Pilih Jam</option>
                    {jamList.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nama} ({j.jam_mulai} - {j.jam_selesai})
                      </option>
                    ))}
                  </select>

                  {/* MAPEL */}
                  <select
                    className="border rounded px-3 py-2"
                    value={row.mapel_id}
                    onChange={(e) => {
                      const copy = [...cards];
                      copy[cardIndex].rows[rowIndex].mapel_id = Number(e.target.value);
                      setCards(copy);
                    }}
                  >
                    <option value={0}>Pilih Mapel</option>
                    {mapelList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nama}
                      </option>
                    ))}
                  </select>

                  {/* GURU */}
                  <select
                    className="border rounded px-3 py-2"
                    value={row.guru_id}
                    onChange={(e) => {
                      const copy = [...cards];
                      copy[cardIndex].rows[rowIndex].guru_id = Number(e.target.value);
                      setCards(copy);
                    }}
                  >
                    <option value={0}>Pilih Guru</option>
                    {guruList.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nama}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* TAMBAH ROW */}
              <Button className="bg-sky-600 text-white mt-1" onClick={() => addRow(cardIndex)}>
                + Tambah Jam / Mapel / Guru
              </Button>
            </div>
          ))}
        </div>

        {/* TAMBAH CARD */}
        <Button className="bg-blue-500 text-white mt-4" onClick={addCard}>
          + Tambah Hari
        </Button>

        {/* ACTION */}
        <div className="flex border-t-2 pt-3 justify-end gap-3 mt-6 pb-6">
          <Button className=" bg-red-500 text-white" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button className="bg-sky-600 text-white" onClick={submit}>
            Simpan Semua
          </Button>
        </div>
      </div>
    </div>
  );
}
