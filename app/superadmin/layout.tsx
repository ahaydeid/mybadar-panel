"use client";
import DashboardClientLayout from "@/app/components/DashboardClientLayout";

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardClientLayout role="superadmin">{children}</DashboardClientLayout>;
}
