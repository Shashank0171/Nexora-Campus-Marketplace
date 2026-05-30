import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";

const authRouter = express.Router();

// ================= REGISTER =================
authRouter.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      department,
      year,
    } = req.body;

    if (!email || !email.endsWith("@anurag.edu.in")) {
      return res.status(400).json({
        success: false,
        message: "Only @anurag.edu.in emails are allowed",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      department,
      year: Number(year),
      role: "student",
      isVerified: true,
      isApproved: false,
    });

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Await admin approval.",
      user,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
});

// ================= LOGIN =================
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked. Contact admin.",
      });
    }

    // IMPORTANT:
    // Do NOT block unapproved users here.
    // They should login and go to PendingApproval page.

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const isProduction =
      process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = await User.findById(
      user._id
    ).select("-password");

    return res.status(200).json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

// ================= CURRENT USER =================
authRouter.get("/me", async (req, res) => {
  try {
    const token =
      req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("ME ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// ================= LOGOUT =================
authRouter.post("/logout", (req, res) => {
  const isProduction =
    process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ================= DEPLOY CHECK =================
authRouter.get("/deploy-check", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Backend running - Admin Approval System Enabled",
  });
});

export default authRouter;