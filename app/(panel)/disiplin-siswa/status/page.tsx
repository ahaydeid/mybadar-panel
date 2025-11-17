import React from "react";
import UnderDevelopment from "@/app/components/UnderDevelopment";

const page = () => {
  return (
    <div>
      <h1 className="text-center text-3xl mt-3 font-bold">Kedisiplinan Siswa - Status Kedisiplinan</h1>
      <h1>
        Ini nanti pakai tabel berisi semua siswa (hanya yang) bermasalah: Nama, Kelas, Status (Misal SP 1,2/ Surat Pemanggilan 1,2/), Keterangan (Berisi potongan deskripsi dari pelanggaran kapan tanggal SP, kapan tanggal Pemanggilan, dan
        kenapa. Ada tombol [lihat] untuk lihat lebih lengkap
      </h1>
      <UnderDevelopment />
    </div>
  );
};
export default page;
