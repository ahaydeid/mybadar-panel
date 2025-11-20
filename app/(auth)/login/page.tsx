"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSessionClient } from "@/lib/session/client"; // <-- FIX

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Jika user sudah login → redirect ke dashboard
  useEffect(() => {
    getSessionClient().then((session) => {
      if (session) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Login gagal");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <main className="w-full max-w-md px-4 sm:px-6 pt-12 pb-6">
        <header className="flex items-center gap-3 px-2 mb-8 justify-center">
          <div className="flex items-center gap-3">
            <Image src="/img/logo-albadar.png" alt="Logo" width={48} height={48} className="rounded-md" priority />
            <div className="leading-tight text-center sm:text-left">
              <div className="text-xl font-extrabold text-sky-600">My Badar</div>
              <div className="text-lg font-semibold text-gray-900">SMKS Al Badar Dangdeur</div>
            </div>
          </div>
        </header>

        <section className="bg-white rounded-lg shadow border border-gray-100 mt-6 p-6 sm:p-8">
          <h1 className="text-center text-2xl font-extrabold tracking-tight text-gray-800 mb-6">Login</h1>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="Masukkan username" type="text" autoComplete="username" />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12"
                placeholder="********"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-sky-600">
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button type="submit" className="w-full bg-sky-600 text-white font-bold rounded-full py-3 shadow-md">
              Login
            </button>

            <div className="text-sm italic text-center text-gray-500">
              <Link href="https://ahadi.my.id" className="hover:text-sky-600">
                Lupa password?
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
