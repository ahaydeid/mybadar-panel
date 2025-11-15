"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { panelMenu } from "@/app/(panel)/menu";
import RoleModal, { RoleFormData } from "../components/RoleModal";
import DetailRoleModal from "../components/DetailRoleModal";

type Role = {
  id: number;
  name: string;
  description: string;
  status: "Aktif" | "Tidak Aktif";
  permissions: string[];
};

export default function ConfigRolePage() {
  const supabase = createClientComponentClient();

  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"add" | "edit" | "detail">("add");
  const [selectedRole, setSelectedRole] = React.useState<RoleFormData | undefined>();

  // =====================================================
  // LOAD ROLES + PERMISSIONS
  // =====================================================
  const loadRoles = React.useCallback(async () => {
    setLoading(true);

    const { data: rolesData, error: rolesErr } = await supabase.from("roles").select("id, name, description, status").order("id");

    if (rolesErr) {
      console.error("Load roles error:", rolesErr);
      setLoading(false);
      return;
    }

    const { data: permData, error: permErr } = await supabase.from("role_permissions").select("role_id, path");

    if (permErr) {
      console.error("Load role permissions error:", permErr);
      setLoading(false);
      return;
    }

    const roleList: Role[] = (rolesData ?? []).map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? "",
      status: r.status === "ACTIVE" ? "Aktif" : "Tidak Aktif",
      permissions: (permData ?? []).filter((p) => p.role_id === r.id).map((p) => p.path),
    }));

    setRoles(roleList);
    setLoading(false);
  }, [supabase]);

  React.useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // =====================================================
  // FILTER + PAGINATION
  // =====================================================
  const filtered = roles.filter((r) => r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase()));

  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // =====================================================
  // HANDLERS
  // =====================================================
  const openAddModal = () => {
    setModalMode("add");
    setSelectedRole(undefined);
    setModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setModalMode("edit");
    setSelectedRole({
      id: role.id,
      name: role.name,
      description: role.description,
      status: role.status,
      permissions: role.permissions,
    });
    setModalOpen(true);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("roles").delete().eq("id", id);

    if (error) {
      alert("Gagal menghapus role.");
      console.error(error);
      return;
    }

    loadRoles();
  };

  // SUBMIT ADD/EDIT
  const handleSubmit = async (data: RoleFormData) => {
    const dbStatus = data.status === "Aktif" ? "ACTIVE" : "INACTIVE";

    let roleId = data.id;

    if (modalMode === "add") {
      const { data: insertRole, error } = await supabase
        .from("roles")
        .insert({
          name: data.name,
          description: data.description,
          status: dbStatus,
        })
        .select("id")
        .single();

      if (error) {
        alert("Gagal menambah role.");
        console.error(error);
        return;
      }

      roleId = insertRole.id;
    } else {
      await supabase
        .from("roles")
        .update({
          name: data.name,
          description: data.description,
          status: dbStatus,
        })
        .eq("id", roleId);
    }

    // Replace permissions
    await supabase.from("role_permissions").delete().eq("role_id", roleId);
    await supabase.from("role_permissions").insert(
      data.permissions.map((p) => ({
        role_id: roleId,
        path: p,
      }))
    );

    setModalOpen(false);
    loadRoles();
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Konfigurasi Role & Hak Akses</h1>
          <p className="text-sm text-gray-500">Atur role dan menu yang dapat diakses masing-masing role.</p>
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

          <Button className="flex items-center gap-2 bg-sky-600 text-white" onClick={openAddModal}>
            <Plus className="w-4 h-4" />
            Tambah Role
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded border bg-white shadow-sm">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-sky-100 text-gray-700">
            <tr>
              <th className="p-3 text-center w-12">No</th>
              <th className="p-3">Nama Role</th>
              <th className="p-3">Deskripsi</th>
              <th className="p-3 w-32">Status</th>
              <th className="p-3 w-40 text-center">Jumlah Akses</th>
              <th className="p-3 w-40 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  Memuat...
                </td>
              </tr>
            )}

            {!loading &&
              paginated.map((role, idx) => (
                <tr key={role.id} className="border-b hover:bg-sky-50">
                  <td className="p-3 text-center">{(page - 1) * rowsPerPage + idx + 1}</td>
                  <td className="p-3 font-medium">{role.name}</td>
                  <td className="p-3 text-xs">{role.description}</td>
                  <td className={`p-3 ${role.status === "Aktif" ? "text-emerald-600" : "text-rose-600"}`}>{role.status}</td>
                  <td className="p-3 text-center">{role.permissions.length} akses</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      {/* DETAIL */}
                      <button
                        className="px-3 py-1.5 bg-blue-500 text-white rounded text-xs flex items-center gap-1"
                        onClick={() => {
                          setSelectedRole({
                            id: role.id,
                            name: role.name,
                            description: role.description,
                            status: role.status,
                            permissions: role.permissions,
                          });
                          setModalMode("detail"); // tambahan
                          setModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                        Detail
                      </button>

                      {/* EDIT */}
                      <button className="px-3 py-1.5 bg-amber-500 text-white rounded text-xs flex items-center gap-1" onClick={() => openEditModal(role)}>
                        <Pencil className="w-4 h-4" /> Edit
                      </button>

                      {/* HAPUS */}
                      <button className="px-3 py-1.5 bg-rose-500 text-white rounded text-xs flex items-center gap-1" onClick={() => handleDelete(role.id)}>
                        <Trash2 className="w-4 h-4" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500 text-sm">
                  Tidak ada role ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalMode !== "detail" && <RoleModal open={modalOpen} mode={modalMode} initialData={selectedRole} menuTree={panelMenu} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />}

      {modalMode === "detail" && <DetailRoleModal open={modalOpen} data={selectedRole} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
