import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  CalendarClock,
  CalendarCheck2,
  School,
  Users2,
  Briefcase,
  FileText,
  FileSpreadsheet,
  LifeBuoy,
  BarChart3,
  Megaphone,
  Settings,
  Shield,
  CalendarDays,
  FolderCog,
  Calendar,
  ClipboardList,
  ClipboardEdit,
  GraduationCap,
  FolderKanban,
  FileCheck2,
} from "lucide-react";

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
  { name: "Hari Ini", icon: CalendarClock, path: "/hari-ini" },

  // Absensi
  {
    name: "Log Absensi",
    icon: CalendarCheck2,
    path: "/absensi",
    children: [
      { name: "Guru", path: "/absensi/guru" },
      { name: "Siswa", path: "/absensi/siswa" },
      { name: "Staff", path: "/absensi/staff" },
    ],
  },

  // Log siswa
  {
    name: "Log Siswa",
    icon: ClipboardList,
    path: "/log-siswa",
    children: [
      { name: "Absensi", path: "/log-siswa/absensi" },
      { name: "Nilai", path: "/log-siswa/nilai" },
    ],
  },

  // Kelas
  {
    name: "Kelas",
    icon: School,
    path: "/kelas",
    children: [
      { name: "Absensi", path: "/kelas/absensi" },
      { name: "Nilai", path: "/kelas/nilai" },
    ],
  },

  // Kelas Binaan
  {
    name: "Kelas Binaan",
    icon: GraduationCap,
    path: "/kelas-binaan",
    children: [
      { name: "Absensi", path: "/kelas-binaan/absensi" },
      { name: "Nilai", path: "/kelas-binaan/nilai" },
    ],
  },

  // Rekap Nilai
  {
    name: "Rekap Nilai",
    icon: FileCheck2,
    path: "/rekap-nilai",
  },

  // Master Data
  {
    name: "Master Data",
    icon: FolderKanban,
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

  // Kedisiplinan Siswa
  {
    name: "Kedisiplinan Siswa",
    icon: ClipboardEdit,
    path: "/disiplin-siswa",
    children: [
      { name: "Status Kedisiplinan", path: "/disiplin-siswa/status" },
      { name: "Pelanggaran", path: "/disiplin-siswa/pelanggaran" },
      { name: "Pembinaan", path: "/disiplin-siswa/pembinaan" },
      { name: "Surat Peringatan (SP)", path: "/disiplin-siswa/sp" },
      { name: "Pemanggilan", path: "/disiplin-siswa/pemanggilan" },
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
      { name: "Rekap PKL", path: "/pkl/rekap-pkl" },
    ],
  },

  // Modul
  { name: "Agenda Ajar", icon: FileText, path: "/agenda" },

  // Export
  { name: "Export Laporan", icon: FileSpreadsheet, path: "/export" },

  // Tiket bantuan
  { name: "Tiket Bantuan", icon: LifeBuoy, path: "/tiket-bantuan" },

  // Laporan (besar)
  { name: "Laporan", icon: BarChart3, path: "/laporan" },

  // Pengumuman
  { name: "Pengumuman", icon: Megaphone, path: "/pengumuman" },

  // Users
  { name: "Users", icon: Users2, path: "/users" },

  // Settings
  { name: "Settings", icon: Settings, path: "/settings" },

  // Kalender Akademik
  { name: "Kalender Akademik", icon: Calendar, path: "/kalender-akademik" },

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
      { name: "Kalender Akademik", icon: Calendar, path: "/config/kalender-akademik" },
    ],
  },
];
