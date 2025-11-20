import type { MenuItem } from "@/app/(panel)/menu";

export type PlainMenu = {
  name: string;
  path: string;
  children?: PlainMenu[];
};

export function sanitizeMenu(menu: MenuItem[]): PlainMenu[] {
  return menu.map((item) => ({
    name: item.name,
    path: item.path,
    children: item.children ? sanitizeMenu(item.children) : undefined,
  }));
}
