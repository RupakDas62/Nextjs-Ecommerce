// models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  price: { type: Number, default: 0 },
  category: { type: String, default: "general" },
  inventory: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

// Avoid recompilation in dev (Next.js reuses modules)
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
