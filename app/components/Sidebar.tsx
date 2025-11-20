"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

import type { MenuItemPlain } from "@/app/(panel)/layout";
import { panelMenu } from "@/app/(panel)/menu";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  menuItems: MenuItemPlain[];
}

// ICON MAP dibuat dari panelMenu asli
const iconMap = Object.fromEntries(panelMenu.map((item) => [item.path, item.icon]));

export default function Sidebar({ isOpen, onToggle, menuItems }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const handleToggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  };

  const isDropdownOpen = (key: string) => openDropdowns.includes(key);

  const isActive = (path: string): boolean => pathname === path || pathname.startsWith(path + "/");

  // FIX: ALWAYS SAFE ARRAY
  const renderMenu = (items: MenuItemPlain[] = [], level = 1): React.JSX.Element[] =>
    items.map((item) => {
      const hasChildren = !!item.children?.length;
      const open = isDropdownOpen(item.path);
      const active = isActive(item.path) || (hasChildren && item.children!.some((c) => isActive(c.path) || c.children?.some((g) => isActive(g.path))));

      const padding = level === 1 ? "p-3" : level === 2 ? "px-4 py-2" : "px-6 py-2";

      const Icon = iconMap[item.path];

      return (
        <div key={item.path}>
          {hasChildren ? (
            <>
              <button
                onClick={() => handleToggleDropdown(item.path)}
                className={`flex items-center gap-3 mb-0.5 w-full ${padding} text-sm transition
                  ${isOpen ? "justify-start" : "justify-center"}
                  ${active ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-sky-50"}`}
              >
                {Icon && <Icon className="w-5 h-5" />}

                {isOpen && (
                  <div className="flex justify-between items-center w-full">
                    <span>{item.name}</span>
                    {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                )}
              </button>

              {open && isOpen && <div className="ml-4">{renderMenu(item.children!, level + 1)}</div>}
            </>
          ) : (
            <Link
              href={item.path}
              className={`flex items-center gap-3 w-full ${padding} text-sm transition
                ${isOpen ? "justify-start" : "justify-center"}
                ${active ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-sky-50"}`}
            >
              {Icon && <Icon className="w-5 h-5" />}
              {isOpen && <span>{item.name}</span>}
            </Link>
          )}
        </div>
      );
    });

  // FINAL SAFETY
  const safeMenuItems = menuItems ?? [];

  return (
    <aside className={`${isOpen ? "w-56" : "w-16"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed top-0 left-0 h-screen z-30`}>
      <div className="flex items-center justify-between px-4 h-14 sticky top-0 bg-white z-10">
        {isOpen && <h1 className="font-bold text-lg text-gray-800">Panel</h1>}
        <button onClick={onToggle} className="p-2 hover:bg-gray-100">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">{renderMenu(safeMenuItems)}</nav>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3">
        <a href="https://ahadi.my.id/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition duration-150">
          <h3 className="text-sm">Created with ❤️ by Hadi</h3>
        </a>
      </div>
    </aside>
  );
}
