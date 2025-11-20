import DateDisplay from "@/components/ui/DateDisplay";

export default function AttendanceHeader({ total, filled, kelasName }: { total: number; filled: number; kelasName?: string | null }) {
  return (
    <>
      <p className="text-xs sm:text-sm md:text-sm font italic text-gray-500 mt-2 text-center flex-1">
        <DateDisplay />
      </p>
      <div className="bg-white p-3 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center text-sm font-semibold mb-2">
          <span>
            {filled}/{total}
          </span>
          <p className="text-lg font-bold">{kelasName}</p>
          <span className="text-gray-400"> ... </span>
        </div>
      </div>
    </>
  );
}
