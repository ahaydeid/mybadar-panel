"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";

import type { MenuItem } from "@/app/(panel)/menu";

export interface RoleFormData {
  id: string;
  name: string;
  description: string;
  status: "Aktif" | "Tidak Aktif";
  permissions: string[]; // path strings
}

interface RoleModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: RoleFormData;
  menuTree: MenuItem[]; // panelMenu
  onClose: () => void;
  onSubmit: (data: RoleFormData) => void;
}

function collectPathsFromMenu(item: MenuItem): string[] {
  const paths: string[] = [];

  const dfs = (node: MenuItem) => {
    paths.push(node.path);
    if (node.children) {
      node.children.forEach(dfs);
    }
  };

  dfs(item);
  return paths;
}

function isItemFullyChecked(item: MenuItem, selected: string[]): boolean {
  const allPaths = collectPathsFromMenu(item);
  return allPaths.every((p) => selected.includes(p));
}

function hasAnyChildChecked(item: MenuItem, selected: string[]): boolean {
  const allPaths = collectPathsFromMenu(item);
  return allPaths.some((p) => selected.includes(p));
}

export default function RoleModal({ open, mode, initialData, menuTree, onClose, onSubmit }: RoleModalProps) {
  const [form, setForm] = React.useState<RoleFormData>({
    id: "",
    name: "",
    description: "",
    status: "Aktif",
    permissions: [],
  });

  const [openGroups, setOpenGroups] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData);
      // buka semua group yang punya child aktif
      const groups: string[] = [];
      menuTree.forEach((item) => {
        if (item.children && hasAnyChildChecked(item, initialData.permissions)) {
          groups.push(item.name);
        }
      });
      setOpenGroups(groups);
    } else {
      setForm({
        id: "",
        name: "",
        description: "",
        status: "Aktif",
        permissions: [],
      });
      setOpenGroups([]);
    }
  }, [mode, initialData, menuTree]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const handleTogglePermission = (item: MenuItem) => {
    setForm((prev) => {
      const current = prev.permissions;
      const allPaths = collectPathsFromMenu(item);

      const allSelected = allPaths.every((p) => current.includes(p));

      let nextPermissions: string[];
      if (allSelected) {
        // uncheck semua terkait item ini
        nextPermissions = current.filter((p) => !allPaths.includes(p));
      } else {
        // tambahkan semua path item + child
        const merged = new Set<string>([...current, ...allPaths]);
        nextPermissions = Array.from(merged);
      }

      return { ...prev, permissions: nextPermissions };
    });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    const data: RoleFormData = {
      ...form,
      id: form.id || form.name.toLowerCase().replace(/\s+/g, "-"),
    };

    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Tambah Role" : "Edit Role"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* NAMA ROLE */}
          <div>
            <label className="text-sm font-medium">Nama Role</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Misal: Admin, Guru, Siswa" />
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="text-sm font-medium">Deskripsi</label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Jelaskan secara singkat peran / hak akses role ini" />
          </div>

          {/* STATUS */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "Aktif" | "Tidak Aktif" })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PERMISSIONS */}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold">Hak Akses (Menu / Fitur)</h3>
                <p className="text-xs text-gray-500">Centang menu yang boleh diakses oleh role ini. Anak menu ikut dicentang mengikuti induknya.</p>
              </div>
              <span className="text-xs text-gray-600">Total akses: {form.permissions.length}</span>
            </div>

            <div className="border rounded-md p-4 max-h-[60vh] overflow-y-auto bg-gray-50">
              {menuTree.map((item) => {
                const fullyChecked = isItemFullyChecked(item, form.permissions);
                const partiallyChecked = !fullyChecked && hasAnyChildChecked(item, form.permissions);

                return (
                  <div key={item.path} className="mb-1">
                    {/* LEVEL 1 */}
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => toggleGroup(item.name)} className="p-1 hover:bg-gray-100 rounded" aria-label={openGroups.includes(item.name) ? "Collapse" : "Expand"}>
                        {item.children ? openGroups.includes(item.name) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" /> : <span className="inline-block w-4" />}
                      </button>

                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={fullyChecked}
                          ref={(el) => {
                            if (el) el.indeterminate = partiallyChecked;
                          }}
                          onChange={() => handleTogglePermission(item)}
                          className="h-4 w-4"
                        />
                        <span>{item.name}</span>
                      </label>
                    </div>

                    {/* LEVEL 2 & 3 */}
                    {item.children && openGroups.includes(item.name) && (
                      <div className="ml-13 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const childFully = isItemFullyChecked(child, form.permissions);
                          const childPartial = !childFully && hasAnyChildChecked(child, form.permissions);

                          return (
                            <div key={child.path}>
                              <div className="flex items-center gap-2">
                                {child.children ? (
                                  // child with its own children (level 2 with level 3)
                                  <>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm">
                                      <input
                                        type="checkbox"
                                        checked={childFully}
                                        ref={(el) => {
                                          if (el) el.indeterminate = childPartial;
                                        }}
                                        onChange={() => handleTogglePermission(child)}
                                        className="h-4 w-4"
                                      />
                                      <span>{child.name}</span>
                                    </label>
                                  </>
                                ) : (
                                  // simple level 2 item
                                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input type="checkbox" checked={form.permissions.includes(child.path)} onChange={() => handleTogglePermission(child)} className="h-4 w-4" />
                                    <span>{child.name}</span>
                                  </label>
                                )}
                              </div>

                              {child.children && (
                                <div className="ml-6 mt-1 space-y-1">
                                  {child.children.map((grand) => (
                                    <label key={grand.path} className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                                      <input type="checkbox" checked={form.permissions.includes(grand.path)} onChange={() => handleTogglePermission(grand)} className="h-4 w-4" />
                                      <span>{grand.name}</span>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700 text-white" onClick={handleSubmit}>
            {mode === "add" ? "Tambah" : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
