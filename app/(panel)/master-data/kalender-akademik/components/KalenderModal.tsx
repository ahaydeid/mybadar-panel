"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils"; // pastikan kamu punya helper ini

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type KegiatanListItem = {
  id: number;
  nama: string;
  kategori: string | null;
};

export default function KalenderModal({ onClose, onSuccess }: Props) {
  const [tanggal, setTanggal] = useState("");
  const [hariEfektif, setHariEfektif] = useState(true);

  const [semesterId, setSemesterId] = useState<number | null>(null);
  const [semesterType, setSemesterType] = useState<string | null>(null);
  const [semesterYear, setSemesterYear] = useState<string | null>(null);

  const [listKegiatan, setListKegiatan] = useState<KegiatanListItem[]>([]);
  const [selectedKegiatanId, setSelectedKegiatanId] = useState<number | null>(null);
  const [selectedKegiatanLabel, setSelectedKegiatanLabel] = useState<string>("");

  const [customKegiatan, setCustomKegiatan] = useState("");
  const [useCustomKegiatan, setUseCustomKegiatan] = useState(false);

  const [loading, setLoading] = useState(false);
  const [openKegiatan, setOpenKegiatan] = useState(false);

  /* LOAD KEGIATAN */
  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from("kegiatan_tahunan").select("id, nama, kategori").order("nama", { ascending: true });

      if (data) setListKegiatan(data);
    })();
  }, []);

  /* DETEKSI SEMESTER */
  const fetchSemesterByDate = async (tgl: string): Promise<void> => {
    const { data, error } = await supabase.from("semester").select("id, tipe, tahun_ajaran, tanggal_mulai, tanggal_selesai");

    if (error || !data) return;

    const dateObj = new Date(tgl);

    const found = data.find((s) => {
      if (!s.tanggal_mulai || !s.tanggal_selesai) return false;

      const mulai = new Date(s.tanggal_mulai);
      const selesai = new Date(s.tanggal_selesai);

      return dateObj >= mulai && dateObj <= selesai;
    });

    if (found) {
      setSemesterId(found.id);
      setSemesterType(found.tipe);
      setSemesterYear(found.tahun_ajaran);
    } else {
      setSemesterId(null);
      setSemesterType(null);
      setSemesterYear(null);
    }
  };

  const handleTanggalChange = (value: string) => {
    setTanggal(value);
    void fetchSemesterByDate(value);
  };

  /* SIMPAN */
  const save = async () => {
    if (!tanggal) return;

    setLoading(true);

    let kegiatanIdToInsert = selectedKegiatanId;

    // Jika custom kegiatan dibuat baru
    if (useCustomKegiatan && customKegiatan.trim().length > 0) {
      const { data: newKegiatan, error } = await supabase
        .from("kegiatan_tahunan")
        .insert({
          nama: customKegiatan,
          kategori: null,
          status: "ACTIVE",
        })
        .select("id")
        .single();

      if (error || !newKegiatan) {
        console.error("Gagal membuat kegiatan baru:", error);
        setLoading(false);
        return;
      }

      kegiatanIdToInsert = newKegiatan.id;
    }

    if (!kegiatanIdToInsert) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("kalender_akademik").insert({
      tanggal,
      hari_efektif: hariEfektif,
      semester_id: semesterId,
      kegiatan_id: kegiatanIdToInsert,
      status: "ACTIVE",
    });

    setLoading(false);

    if (error) return;

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">
        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl">
          ✕
        </button>

        <h2 className="text-xl font-bold text-sky-700 mb-4">Tambah Kalender Akademik</h2>

        {!useCustomKegiatan && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Kegiatan</label>

            <Popover open={openKegiatan} onOpenChange={setOpenKegiatan}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedKegiatanLabel || "Pilih Kegiatan"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari kegiatan..." />

                  <CommandList>
                    <CommandEmpty>Tidak ditemukan</CommandEmpty>

                    <CommandGroup>
                      {listKegiatan.map((k) => (
                        <CommandItem
                          key={k.id}
                          onSelect={() => {
                            setSelectedKegiatanId(k.id);
                            setSelectedKegiatanLabel(k.nama + (k.kategori === "LIBUR" ? " (Libur)" : ""));
                            setOpenKegiatan(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", selectedKegiatanId === k.id ? "opacity-100" : "opacity-0")} />
                          {k.nama}
                          {k.kategori === "LIBUR" ? " (Libur)" : ""}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Button: Kegiatan Lainnya */}
            <button
              onClick={() => {
                setUseCustomKegiatan(true);
                setSelectedKegiatanId(null);
                setSelectedKegiatanLabel("");
              }}
              className="mt-2 text-sm text-sky-600 underline"
            >
              Kegiatan lainnya
            </button>
          </div>
        )}

        {useCustomKegiatan && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Kegiatan</label>

            <div className="flex items-center gap-2">
              <input className="flex-1 border rounded-lg px-3 py-2" placeholder="Nama kegiatan..." value={customKegiatan} onChange={(e) => setCustomKegiatan(e.target.value)} />

              <Button
                variant="outline"
                className="whitespace-nowrap"
                onClick={() => {
                  setUseCustomKegiatan(false);
                  setCustomKegiatan("");
                }}
              >
                Pilih
              </Button>
            </div>
          </div>
        )}

        <label className="block text-sm font-medium mb-1">Tanggal</label>
        <input type="date" className="w-full border rounded-lg px-3 py-2 mb-4" value={tanggal} onChange={(e) => handleTanggalChange(e.target.value)} />

        <label className="block text-sm font-medium mb-1">Hari Efektif?</label>
        <select className="w-full border rounded-lg px-3 py-2 mb-5" value={hariEfektif ? "1" : "0"} onChange={(e) => setHariEfektif(e.target.value === "1")}>
          <option value="1">Ya</option>
          <option value="0">Tidak</option>
        </select>
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-500">Semester</p>
          <div className="border rounded-lg px-3 py-2 bg-gray-100 text-gray-800">{semesterType && semesterYear ? `${semesterYear} – ${semesterType}` : "Belum terdeteksi"}</div>
        </div>

        <button onClick={save} disabled={loading} className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
