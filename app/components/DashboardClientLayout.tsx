"use client";

import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import type { MenuItemPlain } from "@/app/(panel)/layout";

interface DashboardProps {
  children: React.ReactNode;
  role: string;
  name: string;
  menuItems: MenuItemPlain[];
}

export default function DashboardClientLayout({ children, role, name, menuItems }: DashboardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)} menuItems={menuItems} />

      <div className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ${isOpen ? "ml-56" : "ml-16"} min-w-0`}>
        <Topbar role={role} name={name} />
        <main className="flex-1 py-6 px-2 bg-white overflow-y-auto overflow-x-hidden min-w-0">{children}</main>
      </div>
    </div>
  );
}
