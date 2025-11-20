"use client";

import { ReactElement, useEffect, useRef, useState } from "react";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceList from "./AttendanceList";
import AttendanceButtons from "./AttendanceButtons";
import ConfirmSave from "@/components/ui/ConfirmSave";

interface Student {
  id: number;
  name: string;
  status: "" | "H" | "S" | "I" | "A";
}

export default function AttendanceContent(): ReactElement {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const listRef = useRef<HTMLUListElement | null>(null);
  const kelasName = "XII RPL 1";

  useEffect(() => {
    let mounted = true;
    const load = async (): Promise<void> => {
      if (!mounted) return;
      setLoading(true);
      setFetchError(null);

      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!mounted) return;
      const dummyStudents: Student[] = [
        { id: 1, name: "Andi Pratama", status: "" },
        { id: 2, name: "Budi Santoso", status: "" },
        { id: 3, name: "Citra Dewi", status: "" },
        { id: 4, name: "Dedi Gunawan", status: "" },
        { id: 5, name: "Eka Lestari", status: "" },
        { id: 6, name: "Fajar Nugroho", status: "" },
        { id: 7, name: "Gita Rahma", status: "" },
        { id: 8, name: "Hadi Ahadi", status: "" },
        { id: 9, name: "Intan Puspita", status: "" },
        { id: 10, name: "Joko Setiawan", status: "" },
      ];
      setStudents(dummyStudents);
      setLoading(false);
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  /** Scroll highlight */
  useEffect(() => {
    const handleScroll = (): void => {
      if (!listRef.current) return;
      const container = listRef.current;
      const containerCenter = container.scrollTop + container.clientHeight / 2;
      let closestIndex = 0;
      let smallestDistance = Number.POSITIVE_INFINITY;

      Array.from(container.children).forEach((child, index) => {
        const childEl = child as HTMLElement;
        const rectCenter = childEl.offsetTop + childEl.offsetHeight / 2;
        const distance = Math.abs(rectCenter - containerCenter);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentIndex(closestIndex);
    };

    const container = listRef.current;
    if (container) container.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [students]);

  const scrollToStudent = (index: number): void => {
    if (!listRef.current) return;
    const el = listRef.current.children[index] as HTMLElement | undefined;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const updateStatus = (status: Student["status"]): void => {
    if (submitting) return;
    setStudents((prev) => {
      const updated = prev.map((s, i) => (i === currentIndex ? { ...s, status } : s));
      const nextIndex = currentIndex + 1 < updated.length ? currentIndex + 1 : currentIndex;
      window.setTimeout(() => scrollToStudent(nextIndex), 200);
      return updated;
    });
  };

  const handleSubmit = (): void => {
    setSubmitting(true);
    setTimeout(() => {
      alert("✅ Absensi tersimpan (dummy).");
      setSubmitting(false);
    }, 1000);
  };

  const allDone = students.length > 0 && students.every((s) => s.status !== "");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="max-w-md pb-3 bg-white w-full mx-auto">
        <AttendanceHeader total={students.length} filled={students.filter((s) => s.status !== "").length} kelasName={kelasName} />
        <AttendanceList ref={listRef} students={students} loading={loading} fetchError={fetchError} currentIndex={currentIndex} />
        <AttendanceButtons updateStatus={updateStatus} submitting={submitting} allDone={allDone} onSubmit={() => setConfirmOpen(true)} disabled={!allDone || submitting} />
      </main>

      <ConfirmSave
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          handleSubmit();
        }}
        title="Simpan Absen?"
        description="Pastikan semua status kehadiran siswa sudah benar. Lanjutkan menyimpan?"
      />
    </div>
  );
}
