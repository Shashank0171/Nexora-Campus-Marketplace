import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Negotiation data
    offers: [
      {
        offeredBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        price: {
          type: Number,
          required: true,
        },
        message: {
          type: String,
          default: "",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Final agreed price
    finalPrice: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "negotiation",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "negotiation",
    },

    // Optional: track completion time
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Deal = mongoose.model("Deal", dealSchema);

export default Deal;