export default function DashboardPage({ params }: { params: { role?: string } }) {
  const roleName = params?.role ? params.role.charAt(0).toUpperCase() + params.role.slice(1) : "Unknown";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard {roleName}</h1>
      <p className="text-gray-600">
        Ini halaman dummy untuk role <strong>{params?.role ?? "unknown"}</strong>.
      </p>
      <div className="p-4 bg-white border border-gray-200 rounded-md">
        <p className="text-sm text-gray-700">Nanti di sini bisa tampil summary absensi, nilai, dan status PKL.</p>
      </div>
    </div>
  );
}
