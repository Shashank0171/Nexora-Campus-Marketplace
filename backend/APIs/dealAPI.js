import express from "express";
import Deal from "../models/DealModel.js";
import Product from "../models/ProductModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

const dealRouter = express.Router();


// CREATE DEAL
dealRouter.post(
  "/create",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const { productId, sellerId, offerPrice } = req.body;

      if (!productId || !sellerId || !offerPrice) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.isSold || product.status === "Sold") {
        return res.status(400).json({
          success: false,
          message: "Product already sold",
        });
      }

      if (
        product.seller.toString() ===
        req.user._id.toString()
      ) {
        return res.status(400).json({
          success: false,
          message: "You cannot buy your own product",
        });
      }

      const deal = await Deal.create({
        product: productId,
        buyer: req.user._id,
        seller: sellerId,
        status: "negotiation",
        offers: [
          {
            offeredBy: req.user._id,
            price: Number(offerPrice),
            message: "Initial offer",
          },
        ],
      });

      res.status(201).json({
        success: true,
        message: "Deal created successfully",
        deal,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// ADD OFFER
dealRouter.post(
  "/:dealId/offer",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const { price, message } = req.body;

      if (!price) {
        return res.status(400).json({
          success: false,
          message: "Price is required",
        });
      }

      const deal = await Deal.findById(req.params.dealId);

      if (!deal) {
        return res.status(404).json({
          success: false,
          message: "Deal not found",
        });
      }

      const isBuyer =
        deal.buyer.toString() ===
        req.user._id.toString();

      const isSeller =
        deal.seller.toString() ===
        req.user._id.toString();

      const isAdmin =
        req.user.role === "admin";

      if (!isBuyer && !isSeller && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      if (deal.status !== "negotiation") {
        return res.status(400).json({
          success: false,
          message: "Deal already closed",
        });
      }

      deal.offers.push({
        offeredBy: req.user._id,
        price: Number(price),
        message: message || "",
      });

      await deal.save();

      res.json({
        success: true,
        message: "Offer added successfully",
        deal,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// MY DEALS
dealRouter.get(
  "/my",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const deals = await Deal.find({
        $or: [
          { buyer: req.user._id },
          { seller: req.user._id },
        ],
      })
        .populate("product")
        .populate("buyer", "fullName email")
        .populate("seller", "fullName email")
        .populate("offers.offeredBy", "fullName")
        .sort({ createdAt: -1 });

      res.json({
        success: true,
        deals,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default dealRouter;