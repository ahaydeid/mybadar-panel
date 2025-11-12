"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Menu,
  CalendarClock,
  X,
  CalendarCog,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ClipboardCheck,
  Loader2,
  User,
  Briefcase,
  FileSpreadsheet,
  LucideProps,
  LifeBuoy,
  BarChart3,
  Megaphone,
  UserCog,
  Shield,
  Settings,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type MenuItem = {
  name: string;
  icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">> & RefAttributes<SVGSVGElement>;
  path: string;
  children?: MenuItem[];
};

const menuConfig: Record<"superadmin" | "admin" | "guru", MenuItem[]> = {
  superadmin: [
    { name: "Dashboard", icon: LayoutDashboard, path: "/superadmin/dashboard" },
    { name: "Manajemen User & Role", icon: Users, path: "/superadmin/users" },
    { name: "Rekap Kehadiran", icon: ClipboardCheck, path: "/superadmin/rekap-absen" },
    { name: "Rekap Nilai", icon: BookOpen, path: "/superadmin/rekap-nilai" },
    { name: "Rekap PKL", icon: Briefcase, path: "/superadmin/rekap-pkl" },
  ],

  admin: [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Hari Ini", icon: Loader2, path: "/admin/hari-ini" },

    {
      name: "Log Absen",
      icon: ClipboardCheck,
      path: "/admin/absen",
      children: [
        { name: "Guru", path: "/admin/absen/guru" },
        { name: "Siswa", path: "/admin/absen/siswa" },
        { name: "Staff", path: "/admin/absen/staff" },
      ],
    },

    {
      name: "Master Data",
      icon: FileSpreadsheet,
      path: "/admin/master-data",
      children: [
        { name: "Siswa", path: "/admin/master-data/siswa" },
        { name: "Guru", path: "/admin/master-data/guru" },
        { name: "Jurusan", path: "/admin/master-data/jurusan" },
        { name: "Kelas", path: "/admin/master-data/kelas" },
        { name: "Mata Pelajaran", path: "/admin/master-data/mata-pelajaran" },
        { name: "Rombel", path: "/admin/master-data/rombel" },
        { name: "Semester", path: "/admin/master-data/semester" },
        { name: "Tahun Ajaran", path: "/admin/master-data/tahun-ajaran" },
        { name: "Tingkat", path: "/admin/master-data/tingkat" },
      ],
    },
    {
      name: "Manajemen Siswa",
      icon: UserCog,
      path: "/admin/manajemen-siswa",
      children: [
        { name: "Surat Peringatan (SP)", path: "/admin/manajemen-siswa/sp" },
        { name: "Pemanggilan Orang Tua", path: "/admin/manajemen-siswa/pemanggilan" },
        { name: "Catatan Pelanggaran", path: "/admin/manajemen-siswa/pelanggaran" },
        { name: "Riwayat Pembinaan", path: "/admin/manajemen-siswa/pembinaan" },
      ],
    },

    {
      name: "PKL",
      icon: Briefcase,
      path: "/admin/pkl",
      children: [
        { name: "Pengajuan PKL", path: "/admin/pkl/pengajuan" },
        { name: "PKL Berjalan", path: "/admin/pkl/berjalan" },
        { name: "Sidang PKL", path: "/admin/pkl/sidang" },
        { name: "Laporan Akhir", path: "/admin/pkl/laporan" },
        { name: "Riwayat", path: "/admin/pkl/riwayat" },
      ],
    },
    { name: "Jadwal", icon: CalendarClock, path: "/admin/master-jadwal" },
    { name: "Tiket Bantuan", icon: LifeBuoy, path: "/admin/tiket-bantuan" },
    { name: "Laporan", icon: BarChart3, path: "/admin/laporan" },
    { name: "Pengumuman", icon: Megaphone, path: "/admin/pengumuman" },
    { name: "Manajemen Akun", icon: User, path: "/admin/account" },

    {
      name: "Konfigurasi",
      icon: Settings,
      path: "/admin/config",
      children: [
        {
          name: "Konfig Jadwal",
          icon: CalendarCog,
          path: "/admin/config/jadwal",
          children: [
            { name: "Hari", path: "/admin/config/hari" },
            { name: "Jam", path: "/admin/config/jam" },
            { name: "Jam Pelajaran", path: "/admin/config/jp" },
            { name: "Jadwal Mapel", path: "/admin/config/jadwal-mapel" },
            { name: "Semester Aktif", path: "/admin/config/semester-aktif" },
          ],
        },
        {
          name: "Konfig Role",
          icon: Shield,
          path: "/admin/config/role",
        },
      ],
    },
  ],

  guru: [
    { name: "Dashboard", icon: LayoutDashboard, path: "/guru/dashboard" },
    { name: "Rekap Absensi", icon: ClipboardCheck, path: "/guru/absensi" },
    { name: "Nilai Harian", icon: BookOpen, path: "/guru/nilai" },
    { name: "Input & Nilai PKL", icon: Briefcase, path: "/guru/pkl" },
    { name: "Upload Modul", icon: FileText, path: "/guru/modul" },
    { name: "Export Laporan", icon: FileSpreadsheet, path: "/guru/export" },
  ],
};

export default function Sidebar({ role = "admin", isOpen, onToggle }: { role?: "superadmin" | "admin" | "guru"; isOpen: boolean; onToggle: () => void }) {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const pathname = usePathname();
  const menus = menuConfig[role];

  const handleToggleDropdown = (menuName: string) => {
    setOpenDropdowns((prev) => (prev.includes(menuName) ? prev.filter((name) => name !== menuName) : [...prev, menuName]));
  };

  const isDropdownOpen = (menuName: string) => openDropdowns.includes(menuName);

  const isPathActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <aside className={`${isOpen ? "w-56" : "w-16"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed top-0 left-0 h-screen z-30`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 sticky top-0 bg-white z-10">
        {isOpen && <h1 className="font-bold text-lg text-gray-800 capitalize">{role}</h1>}
        <button onClick={onToggle} className="p-2 hover:bg-gray-100 transition">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu utama */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {menus.map((menu, index) => {
          const Icon = menu.icon;
          const active = isPathActive(menu.path) || (menu.children && menu.children.some((sub) => pathname === sub.path || (sub.children && sub.children.some((child) => pathname === child.path))));

          return (
            <div key={index}>
              {menu.children ? (
                <>
                  {/* Level 1 */}
                  <button
                    onClick={() => handleToggleDropdown(menu.name)}
                    className={`flex items-center gap-3 w-full p-3 transition text-sm ${isOpen ? "justify-start px-4" : "justify-center"} ${active ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-sky-50"}`}
                  >
                    {Icon && <Icon className="w-5 h-5 shrink-0" />}
                    {isOpen && (
                      <div className="flex justify-between items-center w-full">
                        <span>{menu.name}</span>
                        {isDropdownOpen(menu.name) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    )}
                  </button>

                  {/* Level 2 */}
                  {isDropdownOpen(menu.name) && isOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                      {menu.children.map((sub, i) => {
                        const subActive = pathname === sub.path || (sub.children && sub.children.some((child) => pathname === child.path));

                        return (
                          <div key={i}>
                            {sub.children ? (
                              <>
                                <button
                                  onClick={() => handleToggleDropdown(sub.name)}
                                  className={`flex items-center justify-between w-full px-2 py-2 text-sm transition ${subActive ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                >
                                  <span>{sub.name}</span>
                                  {isDropdownOpen(sub.name) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>

                                {/* Level 3 */}
                                {isDropdownOpen(sub.name) && (
                                  <div className="ml-6 mt-1 space-y-1">
                                    {sub.children.map((child, j) => {
                                      const childActive = pathname === child.path;
                                      return (
                                        <Link key={j} href={child.path} className={`block w-full text-left px-2 py-2 text-sm transition ${childActive ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                                          {child.name}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link href={sub.path} className={`block w-full text-left px-2 py-2 text-sm transition ${subActive ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                                {sub.name}
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={menu.path}
                  className={`flex items-center gap-3 w-full p-3 transition text-sm ${isOpen ? "justify-start px-4" : "justify-center"} ${active ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-sky-50"}`}
                >
                  {Icon && <Icon className="w-5 h-5 shrink-0" />}
                  {isOpen && <span>{menu.name}</span>}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Menu Profile - Sticky di bawah */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3">
        <Link href="/profile" className={`flex items-center gap-3 text-sm p-2 transition ${pathname === "/profile" ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-sky-50"}`}>
          <User className="w-6 h-6 shrink-0" />
          {isOpen && <span>Profile - Hadi Ahadi</span>}
        </Link>
      </div>
    </aside>
  );
}
