"use client";
import { useState } from "react";
import Sidebar from "@/app/components/Sidebar";

export default function DashboardClientLayout({ children, role }: { children: React.ReactNode; role: "superadmin" | "admin" | "guru" }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)} />
      <main className={`flex-1 overflow-y-auto p-6 bg-white transition-all duration-300 ${isOpen ? "ml-56" : "ml-16"}`}>{children}</main>
    </div>
  );
}
