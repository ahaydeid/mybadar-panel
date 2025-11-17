"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";

import type { MenuItem } from "../(panel)/menu";
import { panelMenu } from "../(panel)/menu";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  const handleToggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  };

  const isDropdownOpen = (key: string) => openDropdowns.includes(key);

  const isActive = (path: string): boolean => pathname === path || pathname.startsWith(path + "/");

  const renderMenu = (items: MenuItem[], level = 1) => {
    return items.map((item) => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const open = isDropdownOpen(item.path);
      const active = isActive(item.path) || (hasChildren && item.children!.some((c) => isActive(c.path) || !!c.children?.some((g) => isActive(g.path))));

      const padding = level === 1 ? "p-3" : level === 2 ? "px-4 py-2" : "px-6 py-2";

      return (
        <div key={item.path}>
          {hasChildren ? (
            <>
              {/* Dropdown button */}
              <button
                onClick={() => handleToggleDropdown(item.path)}
                className={`flex items-center gap-3 mb-0.5 w-full ${padding} text-sm transition ${isOpen ? "justify-start" : "justify-center"} ${active ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-sky-50"}`}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                {isOpen && (
                  <div className="flex justify-between items-center w-full">
                    <span>{item.name}</span>
                    {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                )}
              </button>

              {/* Children */}
              {open && isOpen && <div className="ml-4">{renderMenu(item.children!, level + 1)}</div>}
            </>
          ) : (
            <Link
              href={item.path}
              className={`flex items-center gap-3 w-full ${padding} text-sm transition ${isOpen ? "justify-start" : "justify-center"} ${active ? "bg-sky-600 text-white font-semibold" : "text-gray-700 hover:bg-sky-50"}`}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              {isOpen && <span>{item.name}</span>}
            </Link>
          )}
        </div>
      );
    });
  };

  return (
    <aside className={`${isOpen ? "w-56" : "w-16"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed top-0 left-0 h-screen z-30`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 sticky top-0 bg-white z-10">
        {isOpen && <h1 className="font-bold text-lg text-gray-800">Panel</h1>}
        <button onClick={onToggle} className="p-2 hover:bg-gray-100">
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">{renderMenu(panelMenu)}</nav>

      {/* Profile */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3">
        <a href="https://ahadi.my.id/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition duration-150">
          <h3 className="text-sm">Created with ❤️ by Hadi</h3>
        </a>
      </div>
    </aside>
  );
}
