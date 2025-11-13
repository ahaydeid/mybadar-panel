"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { panelMenu } from "@/app/(panel)/menu";
import RoleModal, { RoleFormData } from "@/app/(panel)/config/components/RoleModal";

type Role = {
  id: string;
  name: string;
  description: string;
  status: "Aktif" | "Tidak Aktif";
  permissions: string[]; // path strings
};

// Dummy awal (supaya tampilan hidup)
const dummyRoles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Mengelola master data, absensi, dan konfigurasi sistem.",
    status: "Aktif",
    permissions: [
      "/dashboard",
      "/hari-ini",
      "/absensi",
      "/absensi/guru",
      "/absensi/siswa",
      "/absensi/staff",
      "/master-data",
      "/master-data/guru",
      "/master-data/siswa",
      "/master-data/jadwal",
      "/master-data/jurusan",
      "/master-data/kelas",
      "/master-data/mata-pelajaran",
      "/config",
      "/config/jadwal",
      "/config/hari",
      "/config/jam",
      "/config/semester",
      "/config/role",
    ],
  },
  {
    id: "guru",
    name: "Guru",
    description: "Mengelola absensi & nilai di kelas yang diampu.",
    status: "Aktif",
    permissions: ["/dashboard", "/hari-ini", "/absensi", "/absensi/guru", "/rekap-absen/guru", "/rekap-nilai", "/modul"],
  },
];

export default function ConfigRolePage() {
  const [roles, setRoles] = React.useState<Role[]>(dummyRoles);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const rowsPerPage = 10;

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit">("add");
  const [selectedRole, setSelectedRole] = React.useState<RoleFormData | undefined>(undefined);

  const filtered = roles.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedRole(undefined);
    setModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    const data: RoleFormData = {
      id: role.id,
      name: role.name,
      description: role.description,
      status: role.status,
      permissions: role.permissions,
    };
    setModalMode("edit");
    setSelectedRole(data);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    // sementara hanya hapus di state
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSubmit = (data: RoleFormData) => {
    if (modalMode === "add") {
      const newRole: Role = {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        permissions: data.permissions,
      };
      setRoles((prev) => [...prev, newRole]);
    } else {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === data.id
            ? {
                ...r,
                name: data.name,
                description: data.description,
                status: data.status,
                permissions: data.permissions,
              }
            : r
        )
      );
    }

    setModalOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Konfigurasi Role & Hak Akses</h1>
          <p className="text-sm text-gray-500">Atur role dan menu apa saja yang dapat diakses oleh masing-masing role.</p>
        </div>

        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Cari role..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />
          <Button className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white" onClick={openAddModal}>
            <Plus className="w-4 h-4" />
            Tambah Role
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-sky-100 text-gray-700 h-12">
            <tr>
              <th className="p-3 w-12 text-center">No</th>
              <th className="p-3">Nama Role</th>
              <th className="p-3">Deskripsi</th>
              <th className="p-3 w-32">Status</th>
              <th className="p-3 w-40 text-center">Jumlah Akses</th>
              <th className="p-3 w-40 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {paginated.map((role, idx) => (
              <tr key={role.id} className="border-b last:border-none hover:bg-sky-50">
                <td className="p-3 text-center">{(page - 1) * rowsPerPage + idx + 1}</td>
                <td className="p-3 font-medium">{role.name}</td>
                <td className="p-3 text-xs text-gray-700">{role.description || "-"}</td>
                <td className={`p-3 font-medium ${role.status === "Aktif" ? "text-emerald-600" : "text-rose-600"}`}>{role.status}</td>
                <td className="p-3 text-center text-sm">{role.permissions.length} route</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button type="button" className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs flex items-center gap-1" onClick={() => openEditModal(role)}>
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button type="button" className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded text-xs flex items-center gap-1" onClick={() => handleDelete(role.id)}>
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500 text-sm">
                  Belum ada role yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end items-center gap-3">
        <span className="text-sm text-gray-600">
          Halaman {page} dari {totalPages}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Sebelumnya
          </Button>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Berikutnya
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <RoleModal open={modalOpen} mode={modalMode} initialData={selectedRole} menuTree={panelMenu} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
