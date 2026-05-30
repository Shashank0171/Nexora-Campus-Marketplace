import express from "express";
import Deal from "../models/DealModel.js";
import Product from "../models/ProductModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

const dealRouter = express.Router();

/* CREATE DEAL */
dealRouter.post("/create", verifyToken(["student", "admin"]), async (req, res) => {
  try {
    const { productId, offerPrice, message } = req.body;

    if (!productId || !offerPrice) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot buy your own product" });
    }

    // create deal with first offer
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

    res.status(201).json({ success: true, deal });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* GET SINGLE DEAL */
dealRouter.get("/:dealId", verifyToken(["student", "admin"]), async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId)
      .populate("product")
      .populate("buyer", "fullName")
      .populate("seller", "fullName")
      .populate("offers.offeredBy", "fullName");

    if (!deal) return res.status(404).json({ message: "Not found" });

    res.json({ success: true, deal });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ADD OFFER */
dealRouter.post("/:dealId/offer", verifyToken(["student", "admin"]), async (req, res) => {
  try {
    const { price, message } = req.body;

    const deal = await Deal.findById(req.params.dealId);
    if (!deal) return res.status(404).json({ message: "Deal not found" });

    if (deal.status !== "negotiation") {
      return res.status(400).json({ message: "Deal closed" });
    }

    // add new offer
    deal.offers.push({
      offeredBy: req.user._id,
      price,
      message: message || "",
    });

    await deal.save();

    res.json({ success: true, deal });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* ACCEPT DEAL (SELLER ONLY) */
dealRouter.patch("/:dealId/accept", verifyToken(["student", "admin"]), async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId);

    if (!deal) return res.status(404).json({ message: "Not found" });

    // only seller can accept
    if (deal.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only seller allowed" });
    }

    deal.status = "accepted";

    // set final price = last offer
    deal.finalPrice = deal.offers?.at(-1)?.price;

    await deal.save();

    res.json({ success: true, deal });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


/* MY DEALS */
dealRouter.get("/my", verifyToken(["student", "admin"]), async (req, res) => {
  try {
    const deals = await Deal.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate("product")
      .populate("buyer", "fullName")
      .populate("seller", "fullName")
      .populate("offers.offeredBy", "fullName")
      .sort({ updatedAt: -1 });

    res.json({ success: true, deals });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default dealRouter;