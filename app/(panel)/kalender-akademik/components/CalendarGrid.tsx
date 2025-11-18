"use client";

import { useState } from "react";
import dayjs from "dayjs";
import AgendaModal from "./AgendaModal";
import { CalendarEvent } from "@/types/kalender";

interface Props {
  currentMonth: dayjs.Dayjs;
  today: dayjs.Dayjs;
  events: CalendarEvent[];
}

export default function CalendarGrid({ currentMonth, today, events }: Props) {
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[] | null>(null);

  const startOfMonth = currentMonth.startOf("month");
  const startDay = startOfMonth.day();
  const days: dayjs.Dayjs[] = [];

  for (let i = 0; i < 42; i++) {
    const dayNumber = i - startDay + 1;
    const date = currentMonth.date(dayNumber);
    days.push(date);
  }

  const openModal = (date: dayjs.Dayjs) => {
    const formattedDate = date.format("YYYY-MM-DD");

    const filtered = events.filter((e) => dayjs(e.tanggal).format("YYYY-MM-DD") === formattedDate);

    setSelectedEvents(filtered.length > 0 ? filtered : []);
  };

  const closeModal = () => setSelectedEvents(null);

  return (
    <>
      {/* Hari Mingguan */}
      <div className="grid grid-cols-7 gap-2 text-center text-gray-700 font-medium mb-2">
        {["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"].map((d) => (
          <div key={d} className="py-2 text-lg text-sky-700 font-semibold">
            {d}
          </div>
        ))}
      </div>

      {/* Grid Tanggal */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const isCurrentMonth = date.month() === currentMonth.month();
          const isToday = date.isSame(today, "day");
          const formattedDate = date.format("YYYY-MM-DD");

          // FIX: Normalisasi tanggal Supabase
          const todayEvents = events.filter((evt) => dayjs(evt.tanggal).format("YYYY-MM-DD") === formattedDate);

          const hasEvent = todayEvents.length > 0;

          const isLibur = todayEvents.some((e) => e.kategori?.toUpperCase() === "LIBUR");

          const isSunday = date.day() === 0;

          const isRedDay = isLibur || isSunday;

          return (
            <button
              key={index}
              onClick={() => openModal(date)}
              className={`relative rounded-xl p-3 text-sm font-medium transition-all border text-left
              
              ${isCurrentMonth ? (isRedDay ? "bg-red-500 text-white border-red-600" : "bg-white text-gray-700 hover:shadow-sm") : "bg-gray-100 text-gray-400"}

              ${isToday && !isRedDay ? "border-sky-500 text-sky-700 font-bold" : ""}
            `}
            >
              {!isRedDay && hasEvent && <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-sky-500"></div>}

              {isRedDay && hasEvent && <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-white"></div>}

              {isCurrentMonth ? date.date() : ""}
            </button>
          );
        })}
      </div>

      {selectedEvents && <AgendaModal events={selectedEvents} onClose={closeModal} />}
    </>
  );
}
