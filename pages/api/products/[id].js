// pages/api/products/[id].js
import connectDB from "../../../lib/mongodb";
import Product from "../../../models/Product";
import { verifyToken } from "../../../lib/auth";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;
  const user = verifyToken(req);

  if (req.method === "GET") {
    const prod = await Product.findById(id);
    if (!prod) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(prod);
  }

  if (req.method === "PUT") {
    console.log(user);
    if (!user || user.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }

  res.status(405).json({ error: "Method not allowed" });
}
