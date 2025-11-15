"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { RoleFormData } from "./RoleModal";

interface Props {
  open: boolean;
  data?: RoleFormData;
  onClose: () => void;
}

export default function DetailRoleModal({ open, data, onClose }: Props) {
  if (!data) return null;

  // Helper: ubah "/absensi/guru" → ["Absensi", "Guru"]
  const splitPath = (path: string) => {
    return path
      .split("/")
      .filter((p) => p.trim() !== "")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Detail Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* NAMA */}
          <div>
            <h3 className="text-sm font-semibold">Nama Role</h3>
            <p className="mt-1 text-base font-bold text-gray-800">{data.name}</p>
          </div>

          {/* DESKRIPSI */}
          <div>
            <h3 className="text-sm font-semibold">Deskripsi</h3>
            <p className="mt-1 text-sm text-gray-700">{data.description || "-"}</p>
          </div>

          {/* STATUS */}
          <div>
            <h3 className="text-sm font-semibold">Status</h3>
            <p className={`mt-1 font-semibold ${data.status === "Aktif" ? "text-emerald-600" : "text-rose-600"}`}>{data.status}</p>
          </div>

          {/* PERMISSIONS */}
          <div>
            <h3 className="text-sm font-semibold">Hak Akses</h3>

            <div className="flex flex-wrap gap-2 mt-2">
              {data.permissions.map((p) => {
                const parts = splitPath(p);

                return (
                  <Badge key={p} variant="secondary" className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-md">
                    {parts.map((part, idx) => (
                      <React.Fragment key={idx}>
                        <span>{part}</span>
                        {idx < parts.length - 1 && <span className="mx-1 text-gray-400">›</span>}
                      </React.Fragment>
                    ))}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
