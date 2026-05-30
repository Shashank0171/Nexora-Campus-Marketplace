import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const verifyToken = (roles = []) => async (req, res, next) => {
  try {
    // get token
    const token =
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //support both userId and id
    const userId = decoded.userId || decoded.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // blocked account
    if (!user.isActive) {
      return res.status(403).json({ message: "Account blocked" });
    }

    // only check approval IF NOT admin AND route requires roles
    if (user.role !== "admin") {
      if (!user.isApproved) {
        return res.status(403).json({ message: "Waiting for approval" });
      }
    }

    // role check (only if roles passed)
    if (roles.length > 0 && !roles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.log("AUTH ERROR:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};