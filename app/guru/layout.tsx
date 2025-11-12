"use client";
import DashboardClientLayout from "@/app/components/DashboardClientLayout";

export default function GuruLayout({ children }: { children: React.ReactNode }) {
  return <DashboardClientLayout role="guru">{children}</DashboardClientLayout>;
}
