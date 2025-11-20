import type { MenuItemPlain } from "@/app/(panel)/layout";

export function filterMenuByPermissions(menu: MenuItemPlain[], allowed: string[]): MenuItemPlain[] {
  if (!Array.isArray(menu)) return [];

  // kalau belum ada permission, untuk sementara tampilkan semua menu
  if (!Array.isArray(allowed) || allowed.length === 0) {
    return menu;
  }

  return menu
    .map((item) => {
      const isAllowed = allowed.some((p) => {
        const clean = p.replace(/\/+$/, "");
        return item.path === clean || item.path.startsWith(clean + "/") || clean.startsWith(item.path);
      });

      if (!isAllowed) return null;

      const children = item.children ? filterMenuByPermissions(item.children, allowed) : undefined;

      return { ...item, children };
    })
    .filter(Boolean) as MenuItemPlain[];
}
