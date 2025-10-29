import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
  const res = await axios.post("/api/auth/signup", form, {
    headers: { "Content-Type": "application/json" },
  });
  const data = res.data;
  console.log(data);
  router.push("/login");
} catch (error) {
  console.error("Signup failed:", error);
}
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-5">
        <h1 className="text-2xl font-bold text-center text-indigo-600">Sign Up</h1>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Register
        </button>
      </form>
    </main>
  );
}
