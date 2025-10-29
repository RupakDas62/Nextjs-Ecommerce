// pages/index.js
import connectDB from "../lib/mongodb";
import ProductCard from "../components/ProductCard";
import { useState } from "react";
import Product from "../models/Product";

export default function Home({ products }) {
  const [q, setQ] = useState("");
  const lower = q.toLowerCase();
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(lower) ||
      p.category?.toLowerCase().includes(lower)
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-600 drop-shadow-sm">
            🍕 NextCommerce
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Discover your favorite pizzas and order effortlessly.
          </p>
        </header>

        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full max-w-md px-5 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 bg-white"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-600 mt-16">
            <p className="text-xl font-medium">No products found 🫠</p>
            <p className="text-sm mt-2">Try a different search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-200">
        Made with ❤️ using Next.js & MongoDB
      </footer>
    </main>
  );
}

export async function getStaticProps() {
  await connectDB();
  const products = await Product.find().lean();

  const cleaned = products.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    category: p.category,
    inventory: p.inventory,
    lastUpdated: p.lastUpdated?.toString(),
  }));

  return {
    props: { products: cleaned },
    revalidate: 3600,
  };
}
