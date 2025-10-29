// components/ProductCard.js
import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div className="p-5 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-xl font-semibold text-indigo-700 mb-2 truncate">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-auto">
          <p className="text-lg font-bold text-gray-800 mb-3">₹{product.price}</p>
          <Link
            href={`/products/${product.slug}`}
            className="inline-block w-full text-center bg-indigo-500 text-white py-2 rounded-full hover:bg-indigo-600 transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
