import express from "express";
import Message from "../models/MessageModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

const messageRouter = express.Router();


// Send Message
messageRouter.post(
  "/send",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const { receiver, product, text } = req.body;

      if (!receiver || !product || !text) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const message = await Message.create({
        sender: req.user._id,
        receiver,
        product,
        text,
      });

      const data = await Message.findById(message._id)
        .populate("sender", "fullName email")
        .populate("receiver", "fullName email")
        .populate("product");

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// Get My Messages
messageRouter.get(
  "/",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const messages = await Message.find({
        $or: [
          { sender: req.user._id },
          { receiver: req.user._id },
        ],
      })
        .populate("sender", "fullName email")
        .populate("receiver", "fullName email")
        .populate("product")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// Get Single Message
messageRouter.get(
  "/message/:id",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const message = await Message.findById(req.params.id)
        .populate("sender", "fullName email")
        .populate("receiver", "fullName email")
        .populate("product");

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      if (
        message.sender._id.toString() !== req.user._id.toString() &&
        message.receiver._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      res.status(200).json({
        success: true,
        message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// Get Conversation
messageRouter.get(
  "/conversation/:receiverId/:productId",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const { receiverId, productId } = req.params;

      const messages = await Message.find({
        product: productId,
        $or: [
          {
            sender: req.user._id,
            receiver: receiverId,
          },
          {
            sender: receiverId,
            receiver: req.user._id,
          },
        ],
      })
        .populate("sender", "fullName email")
        .populate("receiver", "fullName email")
        .sort({ createdAt: 1 });

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// Delete Message
messageRouter.delete(
  "/:id",
  verifyToken(["student", "admin"]),
  async (req, res) => {
    try {
      const message = await Message.findById(req.params.id);

      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      if (
        message.sender.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      await message.deleteOne();

      res.status(200).json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default messageRouter;