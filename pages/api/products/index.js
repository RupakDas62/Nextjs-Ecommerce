// pages/api/products/index.js
import { verifyToken } from "../../../lib/auth";
import connectDB from "../../../lib/mongodb";
import Product from "../../../models/Product";

const ADMIN_KEY = process.env.ADMIN_KEY || "";
export default async function handler(req, res) {
  await connectDB();

  // POST → Create a new product
  if (req.method === "POST") {
    try {
      // 1. Check Authorization header
      // console.log("req reached");
      const authHeader = req.headers.authorization;
      // console.log(authHeader)
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized - No token provided" });
      }

      // 2. Verify token
      const token = authHeader.split(" ")[1];
      // console.log(token)
      let decoded;
      try {
        decoded = verifyToken(req);
        // console.log("Decoded is : "+ decoded)
      } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      // 3. Check role
      if (decoded.role !== "admin") {
        return res.status(403).json({ error: "Forbidden - Only admins can create products" });
      }

      // 4. Continue product creation
      const { name, slug, description, price, category, inventory } = req.body;

      if (!name || !slug || !price) {
        return res.status(400).json({ error: "Name, slug, and price are required" });
      }

      const existing = await Product.findOne({ slug });
      if (existing) {
        return res.status(400).json({ error: "Product with this slug already exists" });
      }

      const product = new Product({
        name,
        slug,
        description,
        price,
        category,
        inventory,
        lastUpdated: new Date(),
      });

      await product.save();

      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // GET → Return all products
  else if (req.method === "GET") {
    const products = await Product.find().lean();
    res.status(200).json(products);
  }

  else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

