import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Loader2, ClipboardCheck, Users, BookOpen, Briefcase, FileText, FileSpreadsheet, LifeBuoy, BarChart3, Megaphone, UserCog, Settings, Shield, CalendarDays, FolderCog } from "lucide-react";

export type MenuItem = {
  name: string;
  icon?: LucideIcon;
  path: string;
  children?: MenuItem[];
};

export const panelMenu: MenuItem[] = [
  // Dashboard
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },

  // Hari ini
  { name: "Hari Ini", icon: Loader2, path: "/hari-ini" },

  // Absensi
  {
    name: "Absensi",
    icon: ClipboardCheck,
    path: "/absensi",
    children: [
      { name: "Guru", path: "/absensi/guru" },
      { name: "Siswa", path: "/absensi/siswa" },
      { name: "Staff", path: "/absensi/staff" },
    ],
  },

  // Rekap Absen
  {
    name: "Rekap Absen",
    icon: ClipboardCheck,
    path: "/rekap-absen",
    children: [
      { name: "Guru", path: "/rekap-absen/guru" },
      { name: "Siswa", path: "/rekap-absen/siswa" },
      { name: "Staff", path: "/rekap-absen/staff" },
    ],
  },

  // Rekap Nilai
  {
    name: "Rekap Nilai",
    icon: BookOpen,
    path: "/rekap-nilai",
  },

  // Master Data
  {
    name: "Master Data",
    icon: FileSpreadsheet,
    path: "/master-data",
    children: [
      { name: "Guru", path: "/master-data/guru" },
      { name: "Siswa", path: "/master-data/siswa" },
      { name: "Jadwal", path: "/master-data/jadwal" },
      { name: "Jurusan", path: "/master-data/jurusan" },
      { name: "Kelas", path: "/master-data/kelas" },
      { name: "Mata Pelajaran", path: "/master-data/mata-pelajaran" },
    ],
  },

  // Manajemen siswa
  {
    name: "Manajemen Siswa",
    icon: UserCog,
    path: "/manajemen-siswa",
    children: [
      { name: "SP", path: "/manajemen-siswa/sp" },
      { name: "Pemanggilan", path: "/manajemen-siswa/pemanggilan" },
      { name: "Pelanggaran", path: "/manajemen-siswa/pelanggaran" },
      { name: "Pembinaan", path: "/manajemen-siswa/pembinaan" },
    ],
  },

  // PKL
  {
    name: "PKL",
    icon: Briefcase,
    path: "/pkl",
    children: [
      { name: "Pengajuan PKL", path: "/pkl/pengajuan" },
      { name: "PKL Berjalan", path: "/pkl/berjalan" },
      { name: "Sidang PKL", path: "/pkl/sidang" },
      { name: "Laporan", path: "/pkl/laporan" },
      { name: "Riwayat", path: "/pkl/riwayat" },
      { name: "Rekap PKL", path: "/rekap-pkl" },
    ],
  },

  // Modul
  { name: "Modul", icon: FileText, path: "/modul" },

  // Export
  { name: "Export", icon: FileSpreadsheet, path: "/export" },

  // Tiket bantuan
  { name: "Tiket Bantuan", icon: LifeBuoy, path: "/tiket-bantuan" },

  // Laporan (besar)
  { name: "Laporan", icon: BarChart3, path: "/laporan" },

  // Pengumuman
  { name: "Pengumuman", icon: Megaphone, path: "/pengumuman" },

  // Users
  { name: "Users", icon: Users, path: "/users" },

  // Settings
  { name: "Settings", icon: Settings, path: "/settings" },

  // Config
  {
    name: "Config",
    icon: FolderCog,
    path: "/config",
    children: [
      {
        name: "Jadwal",
        icon: CalendarDays,
        path: "/config/jadwal",
        children: [
          { name: "Hari", path: "/config/hari" },
          { name: "Jam", path: "/config/jam" },
          { name: "Semester", path: "/config/semester" },
        ],
      },
      { name: "Role", icon: Shield, path: "/config/role" },
    ],
  },
];
