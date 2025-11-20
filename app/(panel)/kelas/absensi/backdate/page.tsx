// app/(panel)/kelas/absensi/backdate/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, X } from "lucide-react";
export default function BackdateAbsensiPage() {
  const [columns, setColumns] = useState<{ id: number; date: string }[]>(() => [{ id: Date.now(), date: "" }]);
  const router = useRouter();

  const handleAdd = () => {
    setColumns((prev) => {
      if (prev.length >= 5) return prev; // batasi maksimal 5 kolom
      return [...prev, { id: Date.now(), date: "" }];
    });
  };

  const handleSelectDate = (colId: number, value: string) => {
    setColumns((prev) => prev.map((c) => (c.id === colId ? { ...c, date: value } : c)));
  };

  const handleRemove = (colId: number) => {
    setColumns((prev) => prev.filter((c) => c.id !== colId));
  };

  const students = [
    { id: 1, name: "Siswa 1", status: "" },
    { id: 2, name: "Siswa 2", status: "" },
    { id: 3, name: "Siswa 3", status: "" },
  ];

  return (
    <div className="p-4">
      {/* HEADER + BUTTON */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Tambah Absensi Backdate</h1>
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
          <CalendarDays className="w-5 h-5" /> Tambah
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="border text-sm max-w-[600px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">No</th>
              <th className="p-2 border">Nama</th>

              {columns.map((c) => (
                <th key={c.id} className="p-2 border min-w-[150px]">
                  <div className="flex items-center gap-2">
                    <input type="date" className="border rounded p-1 w-full" value={c.date} onChange={(e) => handleSelectDate(c.id, e.target.value)} />

                    <button onClick={() => router.push("/kelas/absensi/backdate/attendance")} className="bg-green-600 text-white px-2 py-1 hover:bg-green-700 text-xs whitespace-nowrap">
                      Insert
                    </button>

                    <button onClick={() => handleRemove(c.id)} className="text-red-600 hover:text-red-800">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {students.map((s, index) => (
              <tr key={s.id}>
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border whitespace-nowrap">{s.name}</td>

                {columns.map((c) => (
                  <td key={c.id} className="p-2 border text-center text-gray-400 italic">
                    -
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 pr-2">
        <button onClick={() => router.push("/kelas/absensi/backdate/attendance")} className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 text-sm">
          Masukkan
        </button>
      </div>
    </div>
  );
}
