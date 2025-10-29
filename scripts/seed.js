// scripts/seed.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "nextjs_ecom";

if (!uri) {
    console.log(uri)
  console.error("Set MONGODB_URI in .env");
  process.exit(1);
}

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const products = [
    {
      name: "Classic Pepperoni Pizza",
      slug: "pepperoni-pizza",
      description: "Tomato sauce, mozzarella, pepperoni.",
      price: 299,
      category: "pizza",
      inventory: 10,
      lastUpdated: new Date().toISOString()
    },
    {
      name: "Margherita Pizza",
      slug: "margherita-pizza",
      description: "Basil, tomato, fresh mozzarella.",
      price: 249,
      category: "pizza",
      inventory: 5,
      lastUpdated: new Date().toISOString()
    },
    {
      name: "Veggie Supreme",
      slug: "veggie-supreme",
      description: "Loaded with veggies and cheese.",
      price: 269,
      category: "pizza",
      inventory: 3,
      lastUpdated: new Date().toISOString()
    }
  ];

  await db.collection("products").deleteMany({});
  const result = await db.collection("products").insertMany(products);
  console.log(`Seeded ${result.insertedCount} products.`);
  await client.close();
})();
