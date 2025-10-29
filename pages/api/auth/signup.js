// pages/api/auth/signup.js
import bcrypt from "bcrypt";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await connectDB();
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  console.log("Incoming body:", req.body);
console.log("Raw password:", password);
const hashed = await bcrypt.hash(password, 10);
console.log("Hashed password:", hashed);
  const newUser = await User.create({
  name,
  email,
  password,   // plain text; model hook will hash
  role: role === "admin" ? "admin" : "user",
});

  res.status(201).json({ message: "User created", user: newUser });
}
