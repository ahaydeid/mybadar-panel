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
  id: number | null;
  name: string;
  description: string;
  status: "Aktif" | "Tidak Aktif";
  permissions: string[];
}

interface RoleModalProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: RoleFormData;
  menuTree: MenuItem[];
  onClose: () => void;
  onSubmit: (data: RoleFormData) => void;
}

function collectPathsFromMenu(item: MenuItem): string[] {
  const paths: string[] = [];

  const dfs = (node: MenuItem) => {
    paths.push(node.path);
    if (node.children) node.children.forEach(dfs);
  };

  dfs(item);
  return paths;
}

function isItemFullyChecked(item: MenuItem, selected: string[]): boolean {
  return collectPathsFromMenu(item).every((p) => selected.includes(p));
}

function hasAnyChildChecked(item: MenuItem, selected: string[]): boolean {
  return collectPathsFromMenu(item).some((p) => selected.includes(p));
}

export default function RoleModal({ open, mode, initialData, menuTree, onClose, onSubmit }: RoleModalProps) {
  const [form, setForm] = React.useState<RoleFormData>({
    id: null,
    name: "",
    description: "",
    status: "Aktif",
    permissions: [],
  });

  const [openGroups, setOpenGroups] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData);

      // buka group yang punya child aktif
      const groups: string[] = [];
      menuTree.forEach((item) => {
        if (item.children && hasAnyChildChecked(item, initialData.permissions)) {
          groups.push(item.name);
        }
      });

      setOpenGroups(groups);
    } else {
      // reset ADD
      setForm({
        id: null,
        name: "",
        description: "",
        status: "Aktif",
        permissions: [],
      });
      setOpenGroups([]);
    }
  }, [mode, initialData, menuTree]);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => (prev.includes(name) ? prev.filter((v) => v !== name) : [...prev, name]));
  };

  const handleTogglePermission = (item: MenuItem) => {
    setForm((prev) => {
      const current = prev.permissions;
      const paths = collectPathsFromMenu(item);
      const allSelected = paths.every((p) => current.includes(p));

      let next: string[];
      if (allSelected) {
        next = current.filter((p) => !paths.includes(p));
      } else {
        next = Array.from(new Set([...current, ...paths]));
      }

      return { ...prev, permissions: next };
    });
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    onSubmit({
      ...form,
      id: form.id, // tetap number | null, tidak diubah menjadi string
    });
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
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Jelaskan fungsi role ini" />
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
                <h3 className="text-sm font-semibold">Hak Akses</h3>
                <p className="text-xs text-gray-500">Centang menu yang boleh diakses.</p>
              </div>
              <span className="text-xs text-gray-600">{form.permissions.length} akses</span>
            </div>

            <div className="border rounded-md p-4 max-h-[60vh] overflow-y-auto bg-gray-50">
              {menuTree.map((item) => {
                const fully = isItemFullyChecked(item, form.permissions);
                const partial = !fully && hasAnyChildChecked(item, form.permissions);

                return (
                  <div key={item.path} className="mb-1">
                    {/* LEVEL 1 */}
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => toggleGroup(item.name)} className="p-1 hover:bg-gray-100 rounded">
                        {item.children ? openGroups.includes(item.name) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" /> : <span className="inline-block w-4" />}
                      </button>

                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                          type="checkbox"
                          checked={fully}
                          ref={(el) => {
                            if (el) el.indeterminate = partial;
                          }}
                          onChange={() => handleTogglePermission(item)}
                          className="h-4 w-4"
                        />
                        <span>{item.name}</span>
                      </label>
                    </div>

                    {/* LEVEL 2 & 3 */}
                    {item.children && openGroups.includes(item.name) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const fully2 = isItemFullyChecked(child, form.permissions);
                          const partial2 = !fully2 && hasAnyChildChecked(child, form.permissions);

                          return (
                            <div key={child.path}>
                              {/* level 2 */}
                              <label className="flex items-center gap-2 cursor-pointer text-sm">
                                <input
                                  type="checkbox"
                                  checked={fully2}
                                  ref={(el) => {
                                    if (el) el.indeterminate = partial2;
                                  }}
                                  onChange={() => handleTogglePermission(child)}
                                  className="h-4 w-4"
                                />
                                <span>{child.name}</span>
                              </label>

                              {/* level 3 */}
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
