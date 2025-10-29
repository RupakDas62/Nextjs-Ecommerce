// pages/api/products/slug/[slug].js
import Product from "../../../../models/Product";
import connectDB from "../../../../lib/mongodb";

export default async function handler(req, res) {
  await connectDB();
  const { slug } = req.query;
  const doc = await Product.findOne({ slug });
  if (!doc) return res.status(404).json({ error: "Not found" });
  return res.status(200).json({
    id: doc._id.toString(),
    name: doc.name, slug: doc.slug, description: doc.description,
    price: doc.price, category: doc.category, inventory: doc.inventory, lastUpdated: doc.lastUpdated
  });
}
