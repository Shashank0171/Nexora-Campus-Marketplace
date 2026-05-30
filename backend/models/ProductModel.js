import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {

    // product title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // product description
    description: {
      type: String,
      required: true,
    },

    // product price
    price: {
      type: Number,
      required: true,
    },

    // category
    category: {
      type: String,
      required: true,
    },

    // product condition
    condition: {
      type: String,
      enum: ["New", "Like New", "Used"],
      default: "Used",
    },

    // multiple product images
    images: {
      type: [String],

      validate: {
        validator: function (arr) {

          // minimum 1 image
          // maximum 4 images
          return arr.length >= 1 &&
                 arr.length <= 4;

        },

        message:
          "Upload minimum 1 and maximum 4 images",
      },

      required: true,
    },

    // product seller
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // product status
    status: {
      type: String,
      enum: ["Available", "Sold"],
      default: "Available",
    },

    // sold flag
    isSold: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;