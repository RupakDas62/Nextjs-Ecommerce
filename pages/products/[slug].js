// pages/products/[slug].js
import connectDB from "../../lib/mongodb";
import Product from "../../models/Product";

export default function ProductPage({ product }) {
  if (!product)
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800">
        <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl px-10 py-8 text-center">
          <h2 className="text-3xl font-extrabold text-indigo-600 mb-3">
            Product Not Found 🫠
          </h2>
          <p className="text-gray-600">Looks like this pizza didn’t make it to the oven.</p>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800 py-16 px-6">
      <section className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md shadow-xl rounded-3xl p-10 border border-gray-200">
        <h2 className="text-4xl font-extrabold text-indigo-600 mb-4 drop-shadow-sm">
          {product.name}
        </h2>
        <p className="text-gray-700 text-lg mb-6">{product.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Price</p>
            <p className="text-2xl font-bold text-indigo-700 mt-1">₹{product.price}</p>
          </div>

          <div className="bg-pink-50 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide">Inventory</p>
            <p className="text-2xl font-bold text-pink-700 mt-1">{product.inventory}</p>
          </div>
        </div>

        <div className="text-sm text-gray-500 text-right">
          Last updated:{" "}
          <span className="font-medium text-gray-700">
            {product.lastUpdated
              ? new Date(product.lastUpdated).toLocaleString()
              : "Unknown"}
          </span>
        </div>
      </section>

      <footer className="text-center text-gray-500 text-sm mt-16">
        Made with ❤️ using Next.js & MongoDB
      </footer>
    </main>
  );
}

export async function getStaticPaths() {
  await connectDB();
  const products = await Product.find({}, "slug").lean();
  const paths = products.map((p) => ({ params: { slug: p.slug } }));
  return {
    paths,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  await connectDB();
  const product = await Product.findOne({ slug: params.slug });

  if (!product) {
    return { notFound: true, revalidate: 60 };
  }

  return {
    props: {
      product: {
        id: product._id.toString(),
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        category: product.category,
        inventory: product.inventory,
        lastUpdated: product.lastUpdated
          ? product.lastUpdated.toISOString()
          : null,
      },
    },
    revalidate: 60,
  };
}
