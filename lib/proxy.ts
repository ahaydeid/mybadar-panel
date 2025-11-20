"use server";

import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { SessionData } from "@/lib/session/server";

/* -----------------------------------------
   TYPE DEFINITIONS (TS STRICT)
----------------------------------------- */
type RoleRow = {
  roles: { name: string } | null; // <<< FIX: BUKAN ARRAY
};

/* -----------------------------------------
   LOGIN FUNCTION
----------------------------------------- */
export async function loginWithUsernamePassword(username: string, password: string): Promise<{ ok: false; error: string } | { ok: true; session: SessionData }> {
  const clean = username.trim();

  const { data: user, error } = await supabaseAdmin.from("users").select("id, username, password_hash, status").eq("username", clean).maybeSingle();

  if (error || !user) {
    return { ok: false, error: "User tidak ditemukan" };
  }

  if (user.status !== "ACTIVE") {
    return { ok: false, error: "Akun tidak aktif" };
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return { ok: false, error: "Password salah" };
  }

  // --- GET ROLE (BENAR DARI DB) ---
  const { data: roleRow } = await supabaseAdmin.from("user_roles").select("roles(name)").eq("user_id", user.id).maybeSingle<RoleRow>();

  const role = roleRow?.roles?.name && typeof roleRow.roles.name === "string" ? roleRow.roles.name : "unknown";

  // --- GET NAME (FROM GURU TABLE) ---
  const { data: guru } = await supabaseAdmin.from("guru").select("nama").eq("user_id", user.id).maybeSingle();

  const realName = guru?.nama ?? "User";

  // --- BUILD SESSION ---
  const session: SessionData = {
    userId: user.id,
    role,
    name: realName,
  };

  return { ok: true, session };
}

/* -----------------------------------------
   GET USER PERMISSIONS
----------------------------------------- */
export async function getUserPermissions(userId: number): Promise<string[]> {
  const { data, error } = await supabaseAdmin.from("role_permissions").select("path, roles!inner(user_roles!inner(user_id))").eq("roles.user_roles.user_id", userId);

  if (error || !data) return [];

  return data.map((row) => row.path);
}
