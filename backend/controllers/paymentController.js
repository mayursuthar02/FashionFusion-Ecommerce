import Stripe from "stripe";
import OrderModel from "../models/OrderModel.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_END_POINT_SECRET;

if (!endpointSecret) {
  throw new Error("STRIPE_END_POINT_SECRET is missing");
}

/* ✅ Stripe Checkout */
export const stripeCheckout = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products) {
      return res.status(400).json({ error: "No products found" });
    }

    const currency = "inr";

    const lineItems = products.map((product) => {
      const originalPrice = product.productId.price;
      const discount = product.productId.discount;
      const discountedPrice = originalPrice - originalPrice * (discount / 100);
      const unitAmount = Math.round(discountedPrice * 100);

      return {
        price_data: {
          currency,
          product_data: {
            name: product.productId.name,
            images: [product.productId.images[0]],
            metadata: {
              productId: product.productId._id.toString(),
              vendorId: product.productId.vendorId.toString(),
              size: product.size,
              color: product.productId.color,
              discount: product.productId.discount?.toString(),
              brandName: product.productId.brandName || "",
            },
          },
          unit_amount: unitAmount,
        },
        quantity: product.quantity,
      };
    });

    // ✅ Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "required",
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString(),
      },
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/cancelled`,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    return res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    return res.status(500).json({ error: "Stripe checkout failed" });
  }
};

/* ✅ Helper to fetch product metadata from Stripe line items */
const getLineItems = async (lineItems) => {
  const items = [];

  for (const item of lineItems.data) {
    const product = await stripe.products.retrieve(item.price.product);

    items.push({
      productId: product.metadata.productId,
      vendorId: product.metadata.vendorId,
      name: product.name,
      price: item.price.unit_amount / 100,
      quantity: item.quantity,
      image: product.images,
      size: product.metadata.size,
      color: product.metadata.color,
      discount: product.metadata.discount,
      brandName: product.metadata.brandName,
    });
  }

  return items;
};

export const stripeWebhook = async (req, res) => {
  let event;

  // Verify signature against RAW body.
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.error("Webhook Signature Error:", error.message);
    return res.status(400).send(`Webhook signature error: ${error.message}`);
  }

  console.log("EVENT RECEIVED:", event.type);

  try {
    switch (event.type) {
      /* 1) Create order once */
      case "checkout.session.completed": {
        const session = event.data.object;

        const existingOrder = await OrderModel.findOne({ sessionId: session.id });
        if (existingOrder) {
          console.log("⚠️ Order already exists. Skipping duplicate.");
          break;
        }

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const productDetails = await getLineItems(lineItems);

        const order = new OrderModel({
          productDetails,
          email: session.customer_email,
          userId: session.metadata.userId,
          paymentDetails: {
            paymentId: session.payment_intent,              // <— we'll use this to update later
            payment_method_type: session.payment_method_types,
            payment_status: session.payment_status,
          },
          totalAmount: session.amount_total / 100,
          sessionId: session.id,
          billing_details: {},                              // will be filled later
          receipt_url: "",                                  // will be filled later
          status: "pending",
        });

        await order.save();
        console.log("✅ Order created:", order._id);
        break;
      }

      /* 2) Update brand/last4/billing/receipt using the intent's charge */
      case "payment_intent.succeeded": {
        const pi = event.data.object;                      // PaymentIntent
        const paymentIntentId = pi.id;

        // Get latest charge to read card + billing + receipt
        const charge = await stripe.charges.retrieve(pi.latest_charge);

        // Update the order found by the saved paymentIntent id
        const order = await OrderModel.findOne({
          "paymentDetails.paymentId": paymentIntentId,
        });

        if (!order) {
          console.log("⚠️ Order not found for payment_intent:", paymentIntentId);
          break;
        }

        // Defensive reads (not all fields always exist)
        const pmCard = charge?.payment_method_details?.card || {};

        order.receipt_url = charge?.receipt_url || order.receipt_url || "";
        order.billing_details = charge?.billing_details || order.billing_details || {};
        order.paymentDetails.brand = pmCard.brand || order.paymentDetails.brand || "";
        order.paymentDetails.last4Digit = pmCard.last4 || order.paymentDetails.last4Digit || "";

        await order.save();
        console.log("✅ Order updated with billing/receipt:", order._id);
        break;
      }

      default:
        console.log("Unhandled event:", event.type);
    }

    return res.status(200).send("Received");
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
};