import mongoose from "mongoose";
import randomstring from "randomstring";

const orderSchema = new mongoose.Schema(
  {
    productDetails: {
      type: Array,
      default: [],
    },
    email: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    paymentDetails: {
      paymentId: {
        type: String,
        default: "",
      },
      payment_method_type: [],
      payment_status: {
        type: String,
        default: "",
      },
      brand: {
        type: String,
        default: "",
      },
      last4Digit: {
        type: String,
        default: "",
      },
    },
    status: {
      type: String,
      default: "pending",
    },
    shipping_options: [],
    totalAmount: {
      type: Number,
      default: 0,
    },
    receipt_url: {
      type: String,
      default: "",
    },
    sessionId: {
      type: String,
      default: "",
    },
    billing_details: {
      address: {
        city: String,
        country: String,
        line1: String,
        line2: String,
        postal_code: String,
        state: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
