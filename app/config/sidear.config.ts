// app/config/sidebar.config.ts
export type SidebarItem = {
  label: string;
  icon: string;
  path: string;
  roles: string[];
  children?: SidebarItem[];
};

export const sidebarItems: SidebarItem[] = [
  // === SUPERADMIN ===
  {
    label: "Dashboard Global",
    icon: "LayoutDashboard",
    path: "/dashboard",
    roles: ["superadmin"],
  },
  {
    label: "Manajemen User & Role",
    icon: "Users",
    path: "/users",
    roles: ["superadmin"],
  },
  {
    label: "Rekap Kehadiran",
    icon: "ClipboardCheck",
    path: "/rekap/absensi",
    roles: ["superadmin"],
  },
  {
    label: "Rekap Nilai",
    icon: "BookOpenCheck",
    path: "/rekap/nilai",
    roles: ["superadmin"],
  },
  {
    label: "Rekap PKL",
    icon: "Briefcase",
    path: "/rekap/pkl",
    roles: ["superadmin"],
  },

  // === ADMIN ===
  {
    label: "Dashboard Operasional",
    icon: "LayoutDashboard",
    path: "/dashboard",
    roles: ["admin"],
  },
  {
    label: "Data Master",
    icon: "Database",
    path: "#",
    roles: ["admin"],
    children: [
      { label: "Guru", icon: "User", path: "/data/guru", roles: ["admin"] },
      { label: "Siswa", icon: "GraduationCap", path: "/data/siswa", roles: ["admin"] },
      { label: "Kelas", icon: "School", path: "/data/kelas", roles: ["admin"] },
      { label: "Mapel", icon: "Book", path: "/data/mapel", roles: ["admin"] },
      { label: "Jadwal", icon: "CalendarDays", path: "/data/jadwal", roles: ["admin"] },
    ],
  },
  {
    label: "Rekap Absensi",
    icon: "ClipboardCheck",
    path: "/rekap/absensi",
    roles: ["admin"],
  },
  {
    label: "Rekap Nilai",
    icon: "BookOpenCheck",
    path: "/rekap/nilai",
    roles: ["admin"],
  },
  {
    label: "Manajemen PKL",
    icon: "Briefcase",
    path: "/pkl",
    roles: ["admin"],
  },
  {
    label: "Export Laporan",
    icon: "FileSpreadsheet",
    path: "/export",
    roles: ["admin"],
  },

  // === GURU ===
  {
    label: "Dashboard Rekap Kelas",
    icon: "LayoutDashboard",
    path: "/dashboard",
    roles: ["guru"],
  },
  {
    label: "Absensi",
    icon: "ClipboardList",
    path: "/absensi",
    roles: ["guru"],
  },
  {
    label: "Nilai Harian",
    icon: "BookOpen",
    path: "/nilai",
    roles: ["guru"],
  },
  {
    label: "PKL",
    icon: "Briefcase",
    path: "/pkl",
    roles: ["guru"],
  },
  {
    label: "Upload Modul",
    icon: "FileUp",
    path: "/modul",
    roles: ["guru"],
  },
  {
    label: "Export Laporan",
    icon: "FileSpreadsheet",
    path: "/export",
    roles: ["guru"],
  },
];
