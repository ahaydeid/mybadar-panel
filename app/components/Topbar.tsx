"use client";

import Image from "next/image";
import { UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopbarProps {
  role: string; 
  name: string;
}

export default function Topbar({ role, name }: TopbarProps) {
  const router = useRouter();

  const roleLabel = role && typeof role === "string" ? role.charAt(0).toUpperCase() + role.slice(1) : "User";

  return (
    <header className="w-full h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Bagian Kiri */}
      <div className="flex items-center gap-3">
        <Image src="/img/logo-albadar.png" alt="Logo Al Badar" width={40} height={40} className="object-contain" priority />

        <div className="flex flex-col leading-tight">
          <span className="text-xl font-semibold text-gray-800">SMKS Al Badar Dangdeur</span>
          <span className="text-xs text-gray-600 -mt-0.5">Jl. Raya Gembong–Cariu, Kp. Dangdeur, Desa Sukamurni, Kec. Balaraja, Kab. Tangerang, Banten</span>
        </div>
      </div>

      {/* Bagian Kanan */}
      <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-3 py-2 transition" title="Lihat Profil" onClick={() => router.push("/profile")}>
        <span className="text-sm font-medium text-gray-700">
          <span className="bg-blue-500 py-0.5 px-1 text-xs text-white">{roleLabel}</span> - {name}
        </span>

        <UserCircle className="w-6 h-6 text-gray-700" />
      </div>
    </header>
  );
}
