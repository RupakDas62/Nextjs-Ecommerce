// pages/api/auth/me.js
import { verifyToken } from "../../../lib/auth";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  await connectDB();
  const userData = verifyToken(req);
  if (!userData) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findById(userData.id).select("-password");
  res.status(200).json(user);
}
