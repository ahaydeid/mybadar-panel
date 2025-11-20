// "use client";

// import { useState } from "react";
// import { CheckCircle, XCircle } from "lucide-react";

// // =========================
// // TYPE DEFINITIONS
// // =========================

// type KelasTab = "all" | "10" | "11" | "12";

// interface JadwalItem {
//   id: number;
//   jam: string;
//   mapel: string;
//   guru: string;
//   status: "selesai" | "berlangsung" | "belum"; // status tetap ada di data, tapi tidak ditampilkan
//   color: string;
//   hadir: boolean | null;
// }

// interface DummyKegiatan {
//   id: number;
//   kelas: string;
//   wali: string;
//   siswa: {
//     hadir: number;
//     izin: number;
//     sakit: number;
//     alfa: number;
//   };
//   jadwal: JadwalItem[];
// }

// // =========================
// // DUMMY DATA
// // =========================

// const dummyData: DummyKegiatan[] = [
//   {
//     id: 1,
//     kelas: "12 MPLB 2",
//     wali: "Siti",
//     siswa: { hadir: 25, izin: 25, sakit: 25, alfa: 25 },
//     jadwal: [
//       {
//         id: 1,
//         jam: "07:30 - 09:00",
//         mapel: "Matematika",
//         guru: "Ahmad",
//         status: "selesai",
//         color: "bg-green-500",
//         hadir: true,
//       },
//       {
//         id: 2,
//         jam: "09:45 - 10:30",
//         mapel: "PKN",
//         guru: "Liza",
//         status: "berlangsung",
//         color: "bg-blue-500",
//         hadir: false,
//       },
//       {
//         id: 3,
//         jam: "10:30 - 12:00",
//         mapel: "Coding",
//         guru: "Ahadi",
//         status: "belum",
//         color: "bg-pink-500",
//         hadir: null,
//       },
//     ],
//   },
//   {
//     id: 2,
//     kelas: "10 RPL 1",
//     wali: "Budi",
//     siswa: { hadir: 30, izin: 5, sakit: 2, alfa: 1 },
//     jadwal: [
//       {
//         id: 1,
//         jam: "07:30 - 09:00",
//         mapel: "Basis Data",
//         guru: "Dewi",
//         status: "berlangsung",
//         color: "bg-yellow-500",
//         hadir: true,
//       },
//       {
//         id: 2,
//         jam: "09:45 - 10:30",
//         mapel: "UI/UX",
//         guru: "Riko",
//         status: "belum",
//         color: "bg-purple-500",
//         hadir: null,
//       },
//       {
//         id: 3,
//         jam: "10:30 - 12:00",
//         mapel: "Web",
//         guru: "Rizal",
//         status: "belum",
//         color: "bg-orange-500",
//         hadir: null,
//       },
//     ],
//   },
//   {
//     id: 3,
//     kelas: "11 AKL 2",
//     wali: "Lina",
//     siswa: { hadir: 28, izin: 3, sakit: 4, alfa: 2 },
//     jadwal: [
//       {
//         id: 1,
//         jam: "07:30 - 09:00",
//         mapel: "Akuntansi",
//         guru: "Bambang",
//         status: "selesai",
//         color: "bg-green-500",
//         hadir: true,
//       },
//       {
//         id: 2,
//         jam: "09:45 - 10:30",
//         mapel: "Perpajakan",
//         guru: "Tia",
//         status: "berlangsung",
//         color: "bg-red-500",
//         hadir: false,
//       },
//       {
//         id: 3,
//         jam: "10:30 - 12:00",
//         mapel: "Excel",
//         guru: "Nina",
//         status: "belum",
//         color: "bg-blue-500",
//         hadir: null,
//       },
//     ],
//   },
// ];

// // =========================
// // COMPONENT
// // =========================

// export default function KegiatanBelajar() {
//   const [activeKelas, setActiveKelas] = useState<KelasTab>("all");

//   const tabList: { key: KelasTab; label: string }[] = [
//     { key: "all", label: "Semua" },
//     { key: "10", label: "Kelas 10" },
//     { key: "11", label: "Kelas 11" },
//     { key: "12", label: "Kelas 12" },
//   ];

//   const filteredData = activeKelas === "all" ? dummyData : dummyData.filter((item) => item.kelas.startsWith(activeKelas));

//   return (
//     <div className="space-y-6">
//       {/* TAB FILTER */}
//       <div className="flex gap-1 justify-center">
//         {tabList.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveKelas(tab.key)}
//             className={`px-4 py-1 rounded text-sm font-medium border transition
//               ${activeKelas === tab.key ? "bg-gray-900 text-white border-gray-900 shadow" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}
//             `}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* GRID CARD */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {filteredData.map((kelas) => {
//           const totalSiswa = kelas.siswa.hadir + kelas.siswa.izin + kelas.siswa.sakit + kelas.siswa.alfa;

//           return (
//             <div key={kelas.id} className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-md transition">
//               {/* KELAS */}
//               <div className="inline-block bg-gray-800 text-white px-3 py-1 text-sm font-semibold">{kelas.kelas}</div>

//               {/* WALI */}
//               <p className="mt-4 text-sm text-gray-700">
//                 Wali kelas: <span className="font-semibold">{kelas.wali}</span>
//               </p>

//               {/* SISWA */}
//               <div className="mt-4">
//                 <p className="font-semibold mb-1 text-gray-800">Siswa</p>

//                 <div className="grid grid-cols-2 text-sm gap-y-1 text-gray-600">
//                   <span>Hadir: {kelas.siswa.hadir}</span>
//                   <span>Izin: {kelas.siswa.izin}</span>
//                   <span>Sakit: {kelas.siswa.sakit}</span>
//                   <span>Alfa: {kelas.siswa.alfa}</span>
//                 </div>

//                 {/* TOTAL */}
//                 <p className="mt-2 text-sm font-medium text-gray-800">
//                   Total hadir: {kelas.siswa.hadir} / {totalSiswa}
//                 </p>
//               </div>

//               {/* JADWAL */}
//               <p className="mt-6 mb-3 font-semibold text-gray-800">Jadwal hari ini</p>

//               <div className="space-y-2">
//                 {kelas.jadwal.map((j) => (
//                   <div key={j.id} className="border border-gray-200 rounded bg-gray-50 p-4 flex gap-3">
//                     <div className={`${j.color} w-2 rounded-full`} />

//                     <div className="flex-1">
//                       {/* Jam */}
//                       <div className="text-xs text-gray-500 mb-1 font-medium">{j.jam}</div>

//                       {/* Mapel + Status Guru */}
//                       <div className="flex justify-between items-center">
//                         <span className="text-base font-semibold text-gray-800">{j.mapel}</span>

//                         {j.hadir === true && <CheckCircle className="w-5 h-5 text-green-600" />}

//                         {j.hadir === false && <XCircle className="w-5 h-5 text-red-600" />}
//                       </div>

//                       <p className="text-sm text-gray-500 mt-1">{j.guru}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

import UnderDevelopment from "@/app/components/UnderDevelopment";

const page = () => {
  return (
    <div>
      {/* <h1 className="text-center text-3xl mt-3 font-bold">Kegiatan Sedang Berlangsung</h1> */}
      <UnderDevelopment />
    </div>
  );
};
export default page;
