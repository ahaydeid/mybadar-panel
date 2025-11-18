// app/(panel)/hari-ini/components/KegiatanBelajar.tsx

interface DummyKegiatan {
  id: number;
  kelas: string;
  waliKelas: string;
  siswaHadir: number;
  siswaMasuk: number;
  totalSiswa: number;
  jadwalMapel: string;
  mapelBerlangsung: string;
  guruMapel: string;
  guruHadir: boolean;
}

const dummyData: DummyKegiatan[] = [
  {
    id: 1,
    kelas: "VII-A",
    waliKelas: "Bu Siti",
    siswaHadir: 20,
    siswaMasuk: 22,
    totalSiswa: 30,
    jadwalMapel: "08:00 - 09:30",
    mapelBerlangsung: "Matematika",
    guruMapel: "Pak Ahmad",
    guruHadir: true,
  },
  {
    id: 2,
    kelas: "VIII-B",
    waliKelas: "Pak Budi",
    siswaHadir: 18,
    siswaMasuk: 20,
    totalSiswa: 28,
    jadwalMapel: "08:00 - 09:30",
    mapelBerlangsung: "IPA",
    guruMapel: "Bu Lina",
    guruHadir: false,
  },
];

export default function KegiatanBelajar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {dummyData.map((item) => (
        <div key={item.id} className="border rounded-lg p-4 shadow-sm bg-white space-y-2">
          <h2 className="text-lg font-semibold">{item.kelas}</h2>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Wali kelas:</span> {item.waliKelas}
          </p>

          <p className="text-sm">
            <span className="font-medium">Kehadiran Siswa:</span> {item.siswaHadir}/{item.siswaMasuk} dari total {item.totalSiswa}
          </p>

          <p className="text-sm">
            <span className="font-medium">Jadwal:</span> {item.jadwalMapel}
          </p>

          <p className="text-sm">
            <span className="font-medium">Mapel:</span> {item.mapelBerlangsung}
          </p>

          <p className="text-sm">
            <span className="font-medium">Guru Mapel:</span> {item.guruMapel}{" "}
            <span className={`ml-2 text-xs px-2 py-1 rounded ${item.guruHadir ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{item.guruHadir ? "Hadir" : "Tidak Hadir"}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
