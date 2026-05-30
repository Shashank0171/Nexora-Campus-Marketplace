import express from "express";
import Deal from "../models/DealModel.js";
import Product from "../models/ProductModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

const dealRouter = express.Router();


// =======================
// CREATE DEAL
// =======================
dealRouter.post(
  "/create",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const { productId, offerPrice, message } = req.body;

      if (!productId || !offerPrice) {
        return res.status(400).json({
          success: false,
          message: "productId and offerPrice are required",
        });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.seller.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "You cannot buy your own product",
        });
      }

      if (product.isSold || product.status === "Sold") {
        return res.status(400).json({
          success: false,
          message: "Product already sold",
        });
      }

      const deal = await Deal.create({
        product: productId,
        buyer: req.user._id,
        seller: product.seller,
        status: "negotiation",
        offers: [
          {
            offeredBy: req.user._id,
            price: Number(offerPrice),
            message: message || "Initial offer",
          },
        ],
      });

      return res.status(201).json({
        success: true,
        message: "Deal created successfully",
        deal,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// =======================
// GET SINGLE DEAL
// =======================
dealRouter.get(
  "/:dealId",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const deal = await Deal.findById(req.params.dealId)
        .populate("product")
        .populate("buyer", "fullName email")
        .populate("seller", "fullName email")
        .populate("offers.offeredBy", "fullName email");

      if (!deal) {
        return res.status(404).json({
          success: false,
          message: "Deal not found",
        });
      }

      return res.json({
        success: true,
        deal,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// =======================
// ADD OFFER
// =======================
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

      if (deal.status !== "negotiation") {
        return res.status(400).json({
          success: false,
          message: "Deal is closed",
        });
      }

      const allowed =
        deal.buyer.toString() === req.user._id.toString() ||
        deal.seller.toString() === req.user._id.toString() ||
        req.user.role === "admin";

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      deal.offers.push({
        offeredBy: req.user._id,
        price: Number(price),
        message: message || "",
      });

      await deal.save();

      return res.json({
        success: true,
        message: "Offer added",
        deal,
      });

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// =======================
// ACCEPT DEAL
// =======================
dealRouter.patch(
  "/:dealId/accept",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const deal = await Deal.findById(req.params.dealId);

      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      const isSeller =
        deal.seller.toString() === req.user._id.toString();

      const isAdmin = req.user.role === "admin";

      if (!isSeller && !isAdmin) {
        return res.status(403).json({ message: "Not allowed" });
      }

      deal.status = "accepted";
      deal.finalPrice = deal.offers.at(-1)?.price;

      await deal.save();

      res.json({
        success: true,
        message: "Deal accepted",
        deal,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


// =======================
// REJECT DEAL
// =======================
dealRouter.patch(
  "/:dealId/reject",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const deal = await Deal.findById(req.params.dealId);

      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      const isSeller =
        deal.seller.toString() === req.user._id.toString();

      const isAdmin = req.user.role === "admin";

      if (!isSeller && !isAdmin) {
        return res.status(403).json({ message: "Not allowed" });
      }

      deal.status = "rejected";

      await deal.save();

      res.json({
        success: true,
        message: "Deal rejected",
        deal,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


// =======================
// COMPLETE DEAL
// =======================
dealRouter.patch(
  "/:dealId/complete",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const deal = await Deal.findById(req.params.dealId);

      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      const isBuyer =
        deal.buyer.toString() === req.user._id.toString();

      const isAdmin = req.user.role === "admin";

      if (!isBuyer && !isAdmin) {
        return res.status(403).json({ message: "Not allowed" });
      }

      deal.status = "completed";

      await deal.save();

      res.json({
        success: true,
        message: "Deal completed",
        deal,
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);


// =======================
// MY DEALS
// =======================
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
        .populate("offers.offeredBy", "fullName email")
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