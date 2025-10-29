import Link from "next/link";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedName = localStorage.getItem("name");
    if (token) {
      setRole(storedRole);
      setName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800 font-sans">
      <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">
            <Link href="/">🍕 NextCommerce</Link>
          </h1>

          <nav className="flex gap-6 text-gray-700 font-medium items-center">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            {role && (
              <Link href="/dashboard" className="hover:text-indigo-600">Dashboard</Link>
            )}
            {role === "admin" && (
              <Link href="/admin" className="hover:text-indigo-600">Admin</Link>
            )}

            {!role ? (
              <>
                <Link href="/login" className="hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">
                  Hi, <span className="font-semibold">{name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">{children}</main>

      <footer className="mt-16 text-center text-gray-600 text-sm border-t border-gray-200 py-6">
        <p className="text-base text-gray-500">
          Built for assignment — using{" "}
          <span className="text-indigo-500 font-semibold">SSG / ISR / SSR</span>{" "}
          with ❤️ and caffeine.
        </p>
        <p className="mt-1 text-xs text-gray-400">
          © {new Date().getFullYear()} NextCommerce. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
