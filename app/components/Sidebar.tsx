"use client";

import { useState } from "react";
import { LayoutDashboard, Users, GraduationCap, CalendarClock, FileText, Menu, X, CalendarCog, ChevronDown, ChevronUp, School, BookOpen, ClipboardCheck, Loader2, User, Briefcase, FileSpreadsheet, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type MenuItem = {
  name: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref">> & RefAttributes<SVGSVGElement>;
  path: string;
  children?: { name: string; path: string }[];
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
    { name: "Hari Ini", icon: Loader2, path: "/admin/today" },
    { name: "Master Siswa", icon: Users, path: "/admin/master-siswa" },
    { name: "Master Guru", icon: GraduationCap, path: "/admin/master-guru" },
    { name: "Master Jadwal", icon: CalendarClock, path: "/admin/master-jadwal" },
    { name: "Kelas", icon: School, path: "/admin/kelas" },
    { name: "Mata Pelajaran", icon: BookOpen, path: "/admin/mata-pelajaran" },
    {
      name: "Absen",
      icon: ClipboardCheck,
      path: "/admin/absen",
      children: [
        { name: "Staff", path: "/admin/absen/staff" },
        { name: "Guru", path: "/admin/absen/guru" },
        { name: "Siswa", path: "/admin/absen/siswa" },
      ],
    },
    {
      name: "Konfig Jadwal",
      icon: CalendarCog,
      path: "/admin/config",
      children: [
        { name: "Konfig Kelas", path: "/admin/config-kelas" },
        { name: "Konfig Guru", path: "/admin/config-guru" },
        { name: "Konfig Mapel", path: "/admin/config-mapel" },
        { name: "Konfig Hari", path: "/admin/config-hari" },
        { name: "Konfig Jam", path: "/admin/config-jam" },
        { name: "Konfig Semester", path: "/admin/config-semester" },
        { name: "Konfig JP", path: "/admin/config-jp" },
      ],
    },
    {
      name: "Manajemen PKL",
      icon: Briefcase,
      path: "/admin/pkl",
      children: [
        {
          name: "Delegasi Role",
          path: "/admin/pkl/delegasi",
        },
        {
          name: "Approval PKL",
          path: "/admin/pkl/approval",
        },
        {
          name: "Data Tempat PKL",
          path: "/admin/pkl/tempat",
        },
        {
          name: "Dokumen PKL",
          path: "/admin/pkl/dokumen",
        },
        {
          name: "Nilai PKL",
          path: "/admin/pkl/nilai",
        },
        {
          name: "Jadwal Sidang",
          path: "/admin/pkl/sidang",
        },
        {
          name: "Rekap & Laporan",
          path: "/admin/pkl/laporan",
        },
      ],
    },

    { name: "Laporan", icon: FileText, path: "/admin/laporan" },
    { name: "Akun", icon: User, path: "/admin/account" },
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = menuConfig[role];

  const handleToggleDropdown = (menuName: string) => setOpenDropdown(openDropdown === menuName ? null : menuName);

  return (
    <aside className={`${isOpen ? "w-56" : "w-16"} bg-white border-r border-gray-200 pb-10 transition-all duration-300 flex flex-col fixed top-0 left-0 h-screen z-30`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        {isOpen && <h1 className="font-bold text-lg text-gray-800 capitalize">{role}</h1>}
        <button onClick={onToggle} className="p-2 rounded-md hover:bg-gray-100 transition">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu utama */}
      <nav className="flex-1 overflow-y-auto mt-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {menus.map((menu, index) => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.name;

          return (
            <div key={index}>
              {/* Menu dengan dropdown */}
              {menu.children ? (
                <>
                  <button
                    onClick={() => {
                      handleToggleDropdown(menu.name);
                      setActiveMenu(menu.name);
                    }}
                    className={`flex items-center gap-3 w-full p-3 cursor-pointer transition text-sm ${isOpen ? "justify-start px-4" : "justify-center"} ${isActive ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-sky-50"}`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {isOpen && (
                      <div className="flex justify-between items-center w-full">
                        <span>{menu.name}</span>
                        {openDropdown === menu.name ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    )}
                  </button>

                  {openDropdown === menu.name && isOpen && (
                    <div className="ml-10 mt-1">
                      {menu.children.map((sub, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveMenu(sub.name)}
                          className={`block w-full text-left px-2 py-2 text-sm rounded-md transition ${activeMenu === sub.name ? "text-white font-semibold bg-sky-600" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setActiveMenu(menu.name)}
                  className={`flex items-center gap-3 w-full p-3 cursor-pointer transition text-sm ${isOpen ? "justify-start px-4" : "justify-center"} ${isActive ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-sky-50"}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isOpen && <span>{menu.name}</span>}
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
