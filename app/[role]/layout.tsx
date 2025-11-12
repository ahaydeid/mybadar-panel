import DashboardClientLayout from "@/app/components/DashboardClientLayout";

export default function Layout({ children, params }: { children: React.ReactNode; params: { role: "superadmin" | "admin" | "guru" } }) {
  const { role } = params;

  return <DashboardClientLayout role={role}>{children}</DashboardClientLayout>;
}
