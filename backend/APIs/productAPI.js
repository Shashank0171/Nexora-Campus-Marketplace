import express from "express";
import mongoose from "mongoose";
import Product from "../models/ProductModel.js";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../middleware/upload.js";

const productAPI = express.Router();


// Add Product
productAPI.post(
  "/add",
  verifyToken(["student", "admin"]),
  upload.array("images", 4),
  async (req, res, next) => {
    try {
      const {
        title,
        description,
        price,
        category,
        condition,
      } = req.body;

      if (!title || !description || !price || !category) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Upload at least one image",
        });
      }

      // CLOUDINARY IMAGE URLS
      const imagePaths = req.files.map(
        (file) => file.path
      );

      console.log("Uploaded Images:", imagePaths);

      const product = await Product.create({
        title,
        description,
        price: Number(price),
        category,
        condition: condition || "Used",
        images: imagePaths,
        seller: req.user._id,
      });

      return res.status(201).json({
        success: true,
        message: "Product added successfully",
        product,
      });

    } catch (error) {
      next(error);
    }
  }
);


// Get All Products
productAPI.get("/", async (req, res, next) => {
  try {
    const products = await Product.find({
      status: "Available",
    })
      .populate("seller", "fullName email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products,
    });

  } catch (error) {
    next(error);
  }
});


// Get Single Product
productAPI.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }

    const product = await Product.findById(
      req.params.id
    ).populate("seller", "fullName email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });

  } catch (error) {
    next(error);
  }
});


// Update Product
productAPI.put(
  "/:id",
  verifyToken(["student", "admin"]),
  async (req, res, next) => {
    try {
      const product = await Product.findById(
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (
        product.seller.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      const updatedProduct =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      res.json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });

    } catch (error) {
      next(error);
    }
  }
);


// Delete Product
productAPI.delete(
  "/:id",
  verifyToken(["student", "admin"]),
  async (req, res, next) => {
    try {
      const product = await Product.findById(
        req.params.id
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (
        product.seller.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      await Product.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true,
        message: "Product deleted successfully",
      });

    } catch (error) {
      next(error);
    }
  }
);

export default productAPI;