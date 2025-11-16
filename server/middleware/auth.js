import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access denied, no token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // attach user info to request
    next(); // move to next step (like your controller)
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export  {authMiddleware};