import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-sky-50 to-white dark:from-zinc-900 dark:to-black">
      <main className="flex flex-col items-center justify-center w-full max-w-md p-8 bg-white rounded-2xl shadow-xl dark:bg-zinc-900">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Logo Sekolah" width={80} height={80} className="mb-3" priority />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sistem Pengelolaan Sekolah</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Absensi • Nilai • PKL • Laporan</p>
        </div>

        {/* Tombol Login */}
        <div className="flex flex-col gap-4 w-full">
          <Link href="/login" className="w-full py-3 text-center bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition">
            Masuk ke Sistem
          </Link>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">Versi awal sistem sekolah berbasis Next.js + Supabase</p>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-gray-400 dark:text-gray-600">&copy; {new Date().getFullYear()} Sekolah XYZ. Semua hak dilindungi.</footer>
      </main>
    </div>
  );
}
