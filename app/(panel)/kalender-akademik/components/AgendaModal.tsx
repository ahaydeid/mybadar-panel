"use client";

import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

import { CalendarEvent } from "@/types/kalender";

interface Props {
  events: CalendarEvent[];
  onClose: () => void;
}

export default function AgendaModal({ events, onClose }: Props) {
  const tanggal = events.length > 0 ? dayjs(events[0].tanggal).format("dddd, DD MMM YYYY") : "";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded shadow-xl w-11/12 max-w-md px-2 py-4 relative">
        {/* Tombol Tutup */}
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-600 hover:text-red-500 text-lg">
          ✕
        </button>

        {/* Judul */}
        <h2 className="text-lg font-bold text-sky-700 mb-1 text-center">Kegiatan Kalender Akademik</h2>

        {/* Tanggal */}
        {tanggal && <p className="text-center text-sm text-gray-600 mb-4">{tanggal.charAt(0).toUpperCase() + tanggal.slice(1)}</p>}

        {/* Isi Modal */}
        {events.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">Tidak ada kegiatan untuk tanggal ini.</p>
        ) : (
          <div className="space-y-4">
            {events.map((e) => (
              <div key={e.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                <p className="font-bold text-gray-800">{e.kegiatan ?? "Tidak ada nama kegiatan"}</p>

                <p className="text-sm text-gray-600 mt-1">
                  Hari Efektif: <span className={e.hari_efektif ? "text-green-600" : "text-red-600"}>{e.hari_efektif ? "Ya" : "Tidak"}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
