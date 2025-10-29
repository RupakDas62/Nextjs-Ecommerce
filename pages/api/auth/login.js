// pages/api/auth/login.js
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcrypt";
import { generateToken } from "../../../lib/auth";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;
  // console.log(req.body)
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) return res.status(404).json({ error: "User not found" });

  const hi = await bcrypt.compare("new123", user.password)
  console.log(hi)
  const match = await bcrypt.compare(password, user.password);
  // console.log(match);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = generateToken(user);
  res.status(200).json({
    message: "Login successful",
    token,
    role: user.role,
    name: user.name
  });
}
