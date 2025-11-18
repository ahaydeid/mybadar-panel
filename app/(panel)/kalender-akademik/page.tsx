"use client";

import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarGrid from "./components/CalendarGrid";
import { supabase } from "@/lib/supabase/client";

import { KalenderAkademikRow, CalendarEvent, KegiatanTahunanRow } from "@/types/kalender";

const Page = () => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const today = dayjs();

  const prevMonth = () => setCurrentMonth((prev) => prev.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));

  useEffect(() => {
    let isMounted = true;

    supabase
      .from("kalender_akademik")
      .select(
        `
      id,
      tanggal,
      hari_efektif,
      semester_id,
      status,
      kegiatan_tahunan (
        nama,
        kategori
      )
    `
      )
      .then(({ data, error }) => {
        if (!isMounted || error || !data) return;

        const mapped: CalendarEvent[] = data.map((row: KalenderAkademikRow) => {
          let kegiatanName: string | null = null;
          let kategori: string | null = null;

          const rel = row.kegiatan_tahunan;

          if (Array.isArray(rel)) {
            if (rel.length > 0) {
              kegiatanName = rel[0].nama;
              kategori = rel[0].kategori;
            }
          } else if (rel && typeof rel === "object") {
            const r = rel as KegiatanTahunanRow;
            kegiatanName = r.nama;
            kategori = r.kategori;
          }

          return {
            id: row.id,
            tanggal: row.tanggal,
            kegiatan: kegiatanName,
            hari_efektif: row.hari_efektif,
            kategori,
            semester: row.semester_id ?? null,
            status: row.status ?? null,
          };
        });

        setEvents(mapped);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full min-h-screen px-4 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">Kalender Akademik</h1>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-sky-100 text-sky-600 transition">
            <ChevronLeft className="w-7 h-7" />
          </button>

          <p className="text-2xl font-semibold text-sky-700">{currentMonth.format("MMMM YYYY")}</p>

          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-sky-100 text-sky-600 transition">
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid currentMonth={currentMonth} today={today} events={events} />

      {/* Daftar Kegiatan Bulan Ini */}
      {/* Daftar Kegiatan Bulan Ini */}
      <div className="mt-10">
        {(() => {
          const bulanEvents = events.filter((e) => dayjs(e.tanggal).month() === currentMonth.month());

          if (bulanEvents.length === 0) {
            return <p className="text-sm text-gray-500">Tidak ada kegiatan untuk bulan ini.</p>;
          }

          // 1. Kelompokkan berdasarkan nama kegiatan
          const grouped: Record<string, { tanggal: number[]; kategori: string | null }> = {};

          bulanEvents.forEach((e) => {
            const key = e.kegiatan ?? "Tidak ada kegiatan";
            const tgl = dayjs(e.tanggal).date();

            if (!grouped[key]) {
              grouped[key] = {
                tanggal: [],
                kategori: e.kategori ?? null,
              };
            }

            grouped[key].tanggal.push(tgl);
          });

          // 2. Render hasil gabungan
          return Object.entries(grouped)
            .sort((a, b) => a[1].tanggal[0] - b[1].tanggal[0])
            .map(([kegiatan, info]) => {
              const tanggalStr = info.tanggal.sort((a, b) => a - b).join(", ");
              const bulanStr = currentMonth.format("MMMM");

              return (
                <div key={kegiatan} className="text-sm mb-1">
                  <span className="font-semibold text-gray-700">
                    {tanggalStr} {bulanStr}
                  </span>
                  {": "}
                  <span className={info.kategori === "LIBUR" ? "text-red-500 font-medium" : "text-gray-700"}>{kegiatan}</span>
                </div>
              );
            });
        })()}
      </div>
    </section>
  );
};

export default Page;
