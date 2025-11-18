// app/(panel)/hari-ini/components/AbsensiGuru.tsx
"use client";

import { useState } from "react";
import LokasiAbsenModal from "./LokasiAbsenModal";

interface DummyAbsenGuru {
  id: number;
  nama: string;
  mapel: string;
  jamMasuk: string | null;
  status: "BELUM HADIR" | "HADIR" | "TIDAK HADIR" | "TERLAMBAT";
  lat: number | null;
  lng: number | null;
}

const dummyAbsen: DummyAbsenGuru[] = [
  {
    id: 1,
    nama: "Ahmad Fauzi",
    mapel: "Matematika",
    jamMasuk: "07:10",
    status: "HADIR",
    lat: -6.2001,
    lng: 106.8167,
  },
  {
    id: 2,
    nama: "Siti Rahma",
    mapel: "IPA",
    jamMasuk: null,
    status: "BELUM HADIR",
    lat: null,
    lng: null,
  },
  {
    id: 3,
    nama: "Budi Santoso",
    mapel: "Bahasa Indonesia",
    jamMasuk: "07:45",
    status: "TERLAMBAT",
    lat: -6.2101,
    lng: 106.82,
  },
];

export default function AbsensiGuru() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });

  const openModal = (lat: number | null, lng: number | null) => {
    setLocation({ lat, lng });
    setOpen(true);
  };

  return (
    <div>
      {/* Tabel */}
      <div className="overflow-x-auto border rounded-lg bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Mengajar</th>
              <th className="p-3">Jam Masuk</th>
              <th className="p-3">Status</th>
              <th className="p-3">Lokasi</th>
            </tr>
          </thead>
          <tbody>
            {dummyAbsen.map((item, idx) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{item.nama}</td>
                <td className="p-3">{item.mapel}</td>
                <td className="p-3">{item.jamMasuk ?? "-"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      item.status === "HADIR" ? "bg-green-100 text-green-700" : item.status === "TERLAMBAT" ? "bg-yellow-100 text-yellow-700" : item.status === "TIDAK HADIR" ? "bg-red-100 text-red-700" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => openModal(item.lat, item.lng)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                    Lihat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Lokasi (Komponen Terpisah) */}
      <LokasiAbsenModal open={open} onClose={() => setOpen(false)} lat={location.lat} lng={location.lng} />
    </div>
  );
}
