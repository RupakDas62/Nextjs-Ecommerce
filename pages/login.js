import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
  e.preventDefault();
  try {
    const res = await axios.post("/api/auth/login", { email, password }, {
  headers: { "Content-Type": "application/json" },
});
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("name", res.data.name);

    
Cookies.set("token", res.data.token, { expires: 1 }); // expires in 1 day
Cookies.set("role", res.data.role, { expires: 1 });
Cookies.set("name", res.data.name, { expires: 1 });

    console.log(res.data);

    // Force a reload after redirect to update Layout state
    if (res.data.role === "admin") {
      router.replace("/admin").then(() => window.location.reload());
    } else {
      router.replace("/").then(() => window.location.reload());
    }
  } catch (err) {
    alert(err.response?.data?.error || "Login failed");
  }
}


  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-md p-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-md p-2 mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md">
          Login
        </button>
      </form>
    </main>
  );
}
