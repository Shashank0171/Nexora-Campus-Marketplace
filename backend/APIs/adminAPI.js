import express from "express";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

const adminRouter = express.Router();

// Get All Users
adminRouter.get(
  "/users",
  verifyToken(["admin"]),
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Get All Products
adminRouter.get(
  "/products",
  verifyToken(["admin"]),
  async (req, res) => {
    try {
      const products = await Product.find();

      res.status(200).json({
        success: true,
        count: products.length,
        products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Delete Product
adminRouter.delete(
  "/product/:id",
  verifyToken(["admin"]),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Delete User
adminRouter.delete(
  "/user/:id",
  verifyToken(["admin"]),
  async (req, res) => {
    try {
      if (req.user._id.toString() === req.params.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot delete your own account",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.role === "admin") {
        return res.status(400).json({
          success: false,
          message: "Admin accounts cannot be deleted",
        });
      }

      await User.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Approve / Revoke User Approval
adminRouter.put(
  "/user/approve/:id",
  verifyToken(["admin"]),
  async (req, res) => {
    try {
      const { isApproved } = req.body;

      if (typeof isApproved !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isApproved must be a boolean value",
        });
      }

      if (req.user._id.toString() === req.params.id) {
        return res.status(400).json({
          success: false,
          message: "You cannot change your own approval status",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.role === "admin") {
        return res.status(400).json({
          success: false,
          message: "Cannot change approval status of an admin",
        });
      }

      user.isApproved = isApproved;
      await user.save();

      res.status(200).json({
        success: true,
        message: isApproved
          ? "User approved successfully"
          : "User approval revoked successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default adminRouter;