// scripts/seed.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "nextjs_ecom";

if (!uri) {
  console.error("Set MONGODB_URI in .env");
  process.exit(1);
}

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const products = [
    {
      name: "Wireless Bluetooth Headphones",
      slug: "wireless-bluetooth-headphones",
      description:
        "High-quality wireless headphones with noise cancellation and 20-hour battery life.",
      price: 2499,
      category: "electronics",
      inventory: 15,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "Men's Classic Denim Jacket",
      slug: "mens-classic-denim-jacket",
      description:
        "Durable blue denim jacket with button closure and front pockets. Timeless style for all seasons.",
      price: 1899,
      category: "fashion",
      inventory: 8,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "Smart Fitness Watch",
      slug: "smart-fitness-watch",
      description:
        "Track your heart rate, steps, sleep, and more with this waterproof smartwatch compatible with Android and iOS.",
      price: 3299,
      category: "wearables",
      inventory: 12,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "Cotton Graphic T-Shirt",
      slug: "cotton-graphic-tshirt",
      description:
        "Soft, breathable 100% cotton T-shirt with minimalist graphic print. Perfect for daily wear.",
      price: 699,
      category: "fashion",
      inventory: 25,
      lastUpdated: new Date().toISOString(),
    },
    {
      name: "USB-C Charging Cable (1.5m)",
      slug: "usb-c-charging-cable",
      description:
        "Fast-charging Type-C cable with reinforced nylon braid for extra durability. Compatible with all USB-C devices.",
      price: 299,
      category: "accessories",
      inventory: 30,
      lastUpdated: new Date().toISOString(),
    },
  ];

  await db.collection("products").deleteMany({});
  const result = await db.collection("products").insertMany(products);
  console.log(`Seeded ${result.insertedCount} products.`);
  await client.close();
})();
