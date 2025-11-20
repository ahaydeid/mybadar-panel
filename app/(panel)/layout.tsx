import { ReactNode } from "react";

import { requireSession } from "@/lib/session/server";
import { getUserPermissions } from "@/lib/proxy";

import { panelMenu, type MenuItem } from "@/app/(panel)/menu";
import { filterMenuByPermissions } from "@/lib/rbac";
import DashboardClientLayout from "@/app/components/DashboardClientLayout";

// Plain menu item → tanpa icon karena dikirim ke client
export interface MenuItemPlain {
  name: string;
  path: string;
  children?: MenuItemPlain[];
}

// Sanitizer (hapus icon)
function stripIcons(menu: MenuItem[]): MenuItemPlain[] {
  return menu.map((item) => ({
    name: item.name,
    path: item.path,
    children: item.children ? stripIcons(item.children) : undefined,
  }));
}

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await requireSession();
  const permissions = await getUserPermissions(session.userId);

  const safeMenu = stripIcons(panelMenu);
  const allowedMenu = filterMenuByPermissions(safeMenu, permissions);

  return (
    <DashboardClientLayout role={session.role} name={session.name} menuItems={allowedMenu}>
      {children}
    </DashboardClientLayout>
  );
}
