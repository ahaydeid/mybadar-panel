import { Check } from "lucide-react";

export default function AttendanceButtons({ updateStatus, submitting, allDone, onSubmit, disabled }: { updateStatus: (s: "H" | "S" | "I" | "A") => void; submitting: boolean; allDone: boolean; onSubmit: () => void; disabled: boolean }) {
  return (
    <>
      <div className="flex justify-around mt-4">
        <button onClick={() => updateStatus("H")} disabled={submitting} className="bg-green-600 w-19 h-15 rounded-md flex items-center justify-center active:bg-green-700 transition-colors duration-150">
          <Check className="text-white w-10 h-10" />
        </button>
        <button onClick={() => updateStatus("S")} disabled={submitting} className="bg-yellow-400 w-19 h-15 rounded-md flex items-center justify-center font-bold text-3xl active:bg-yellow-500 transition-colors duration-150">
          S
        </button>
        <button onClick={() => updateStatus("I")} disabled={submitting} className="bg-sky-400 w-19 h-15 rounded-md flex items-center justify-center font-bold text-3xl text-white active:bg-sky-500 transition-colors duration-150">
          I
        </button>
        <button onClick={() => updateStatus("A")} disabled={submitting} className="bg-red-500 w-19 h-15 rounded-md flex items-center justify-center font-bold text-3xl text-white active:bg-red-600 transition-colors duration-150">
          A
        </button>
      </div>

      <div className="px-3">
        <button
          disabled={disabled}
          onClick={onSubmit}
          className={`w-full py-3 mt-4 rounded-full text-lg font-semibold flex items-center justify-center gap-2 transition ${
            allDone && !submitting && !disabled ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          <Check className="w-5 h-5" />
          {submitting ? "Menyimpan..." : "Selesai"}
        </button>
      </div>
    </>
  );
}
