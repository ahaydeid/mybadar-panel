"use client";
import DashboardClientLayout from "@/app/components/DashboardClientLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardClientLayout role="admin">{children}</DashboardClientLayout>;
}
