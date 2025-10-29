import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("name");
      const role = localStorage.getItem("role");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      setUser({ name, role });

      try {
        const res = await axios.get("/api/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        setProducts(data);
        const lowStock = data.filter((p) => p.inventory <= 5).length;
        setStats({
          total: data.length,
          lowStock,
          refreshedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }

    loadData();
  }, []);

  if (!user || !stats)
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading your dashboard...</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 text-gray-800">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-indigo-700 drop-shadow-sm">
            👋 Welcome, {user.name}!
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            You are logged in as a <b>{user.role}</b>.
          </p>
        </header>

        <div className="bg-white shadow-lg rounded-2xl p-6 mb-10 border border-gray-100">
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <li className="bg-indigo-50 rounded-xl py-4">
              <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Products</p>
            </li>
            <li className="bg-yellow-50 rounded-xl py-4">
              <p className="text-3xl font-bold text-yellow-600">{stats.lowStock}</p>
              <p className="text-sm text-gray-500">Low Stock (≤ 5)</p>
            </li>
            <li className="bg-green-50 rounded-xl py-4">
              <p className="text-3xl font-bold text-green-600">
                {new Date(stats.refreshedAt).toLocaleTimeString()}
              </p>
              <p className="text-sm text-gray-500">Last Refreshed</p>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
            <h3 className="text-xl font-semibold text-gray-700">🛒 Product List</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Inventory
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-6 py-4 text-gray-700 font-medium">{p.name}</td>
                  <td className="px-6 py-4 text-gray-500">{p.category || "—"}</td>
                  <td className="px-6 py-4 font-semibold text-indigo-600">₹{p.price}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      p.inventory <= 5 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {p.inventory}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="text-center text-gray-500 text-sm py-8 mt-10 border-t border-gray-200">
          Built with ❤️ using Next.js & MongoDB
        </footer>
      </section>
    </main>
  );
}
