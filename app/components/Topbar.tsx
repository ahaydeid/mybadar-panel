"use client";

import Image from "next/image";
import { UserCircle } from "lucide-react";

interface TopbarProps {
  role: "superadmin" | "admin" | "guru";
  name: string;
}

export default function Topbar({ role, name }: TopbarProps) {
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <header className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Bagian Kiri */}
      <div className="flex items-center gap-3">
        <Image src="/img/logo-albadar.png" alt="Logo Al Badar" width={40} height={40} className="object-contain" priority />

        <span className="text-xl font-semibold text-gray-800">SMKS Al Badar Dangdeur</span>
      </div>

      {/* Bagian Kanan */}
      <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-md transition" title="Lihat Profil">
        <span className="text-sm font-medium text-gray-700">
          {roleLabel} - {name}
        </span>

        <UserCircle className="w-6 h-6 text-gray-700" />
      </div>
    </header>
  );
}
