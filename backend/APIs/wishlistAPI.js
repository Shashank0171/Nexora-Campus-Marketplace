import express from "express";
import Wishlist from "../models/WishlistModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();


// GET WISHLIST
router.get(
  "/",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({
        user: req.user._id,
      }).populate("products");

      if (!wishlist) {
        return res.json({
          success: true,
          wishlist: {
            products: [],
          },
        });
      }

      res.json({
        success: true,
        wishlist,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// ADD PRODUCT TO WISHLIST
router.post(
  "/add",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }

      let wishlist = await Wishlist.findOne({
        user: req.user._id,
      });

      if (!wishlist) {
        wishlist = await Wishlist.create({
          user: req.user._id,
          products: [],
        });
      }

      const exists = wishlist.products.some(
        (id) => id.toString() === productId
      );

      if (!exists) {
        wishlist.products.push(productId);
        await wishlist.save();
      }

      await wishlist.populate("products");

      res.json({
        success: true,
        message: "Product added to wishlist",
        wishlist,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// REMOVE PRODUCT FROM WISHLIST
router.delete(
  "/remove/:productId",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const { productId } = req.params;

      const wishlist = await Wishlist.findOne({
        user: req.user._id,
      });

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "Wishlist not found",
        });
      }

      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );

      await wishlist.save();
      await wishlist.populate("products");

      res.json({
        success: true,
        message: "Product removed from wishlist",
        wishlist,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;