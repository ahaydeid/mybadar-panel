import React from "react";

interface Student {
  id: number;
  name: string;
  status: "" | "H" | "S" | "I" | "A";
}

type Props = {
  students: Student[];
  loading: boolean;
  fetchError: string | null;
  currentIndex: number;
};

const AttendanceList = React.forwardRef<HTMLUListElement, Props>(({ students, loading, fetchError, currentIndex }, ref) => (
  <div className="relative h-100 overflow-hidden">
    <ul ref={ref} className="relative z-10 overflow-y-auto scroll-smooth h-96 pb-43 pt-43">
      {loading ? (
        <li className="text-center py-2 text-white">Memuat daftar siswa...</li>
      ) : fetchError ? (
        <li className="text-center py-2 text-red-500">Error: {fetchError}</li>
      ) : students.length === 0 ? (
        <li className="text-center py-2 text-white italic">Tidak ada siswa</li>
      ) : (
        students.map((s, index) => (
          <li
            key={s.id}
            className={`flex justify-center items-center gap-2 px-3 py-2 mb-2 rounded-full transition-all duration-300 text-center ${index === currentIndex ? "font-bold text-white text-xl" : s.status ? "text-gray-400" : "text-gray-300"}`}
          >
            <span>{s.name}</span>
            {s.status && (
              <div
                className={`w-5 h-5 flex items-center justify-center rounded-sm text-[10px] font-bold text-white ${
                  s.status === "H" ? "bg-green-600" : s.status === "S" ? "bg-yellow-400 text-gray-900" : s.status === "I" ? "bg-sky-400" : "bg-red-500"
                }`}
              >
                {s.status}
              </div>
            )}
          </li>
        ))
      )}
    </ul>

    <div className="absolute inset-x-0 -translate-y-1/2 pointer-events-none flex justify-center z-0" style={{ top: "calc(50% - 10px)" }}>
      <div className="w-full h-15" style={{ backgroundColor: "#000000" }} />
    </div>
  </div>
));

AttendanceList.displayName = "AttendanceList";
export default AttendanceList;
