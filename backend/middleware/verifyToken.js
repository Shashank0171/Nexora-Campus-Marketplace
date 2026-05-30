import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const verifyToken = (roles = []) => async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // =========================
    // APPROVAL LOGIC (FIXED)
    // =========================
    // Only block SELLERS if not approved
    if (user.role === "seller" && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: "Waiting for admin approval",
      });
    }

    // =========================
    // ROLE CHECK
    // =========================
    if (roles.length > 0 && !roles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};