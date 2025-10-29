import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    inventory: "",
  });

  // Fetch all products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    fetchProducts();
  }, []);

  // Create new product
  async function handleCreate(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/products", form, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setProducts((prev) => [...prev, res.data.product]);
      setForm({
        name: "",
        slug: "",
        description: "",
        price: "",
        category: "",
        inventory: "",
      });
      alert("Product created successfully!");
    } catch (err) {
      console.error("Error creating product:", err);
      alert("Failed to create product.");
    }
  }

  // Update inventory
  async function handleUpdateInventory(id) {
    const token = localStorage.getItem("token");
    const newInventory = prompt("Enter new inventory count:");
    if (!newInventory) return;
    try {
      const res = await axios.put(
        `/api/products/${id}`,
        { inventory: Number(newInventory) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts((prev) =>
        prev.map((p) => (p._id === res.data._id ? res.data : p))
      );
    } catch (err) {
      console.error("Error updating inventory:", err);
      alert("Failed to update inventory.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800 p-8">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center">
        🛠 Inventory Management
      </h1>

      {/* Create product form */}
      <form
        onSubmit={handleCreate}
        className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-xl mb-10"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Inventory"
            value={form.inventory}
            onChange={(e) => setForm({ ...form, inventory: e.target.value })}
            className="border p-2 rounded"
          />
        </div>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full mt-4"
        />
        <button
          type="submit"
          className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Create Product
        </button>
      </form>

      {/* Product list */}
      <section className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Current Products
        </h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {products.map((p) => (
              <li key={p._id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-indigo-700">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{p.price} • {p.inventory} in stock
                  </p>
                </div>
                <button
                  onClick={() => handleUpdateInventory(p._id)}
                  className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
                >
                  Update Inventory
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
