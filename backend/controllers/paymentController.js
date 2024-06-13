import Stripe from "stripe";
import OrderModel from "../models/OrderModel.js";
const stripe = new Stripe(
  "sk_test_51PLPFeSHDy8obYAWHyJYv5erKFcXiOwcFAesWbLgpkB2HD7SiWbQakVgrKBXk7OWHTvH5JVmXv0ZvXifjynFtv9700MNUsyWqe"
);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_e7488f89d44e2fd423b0419ac83d5ae5bec1c680a47dee266f789659dde0b4b0";

// Variable for sessionID store
let session_id = '';
 
// Stripe Checkout
const stripeCheckout = async (req, res) => {
  try {
    const { products } = req.body;
    if(!products) return res.status(404).json({ error: "products not found" });

    // Store Data
    const currency = "inr";
    const lineItems = products.map((product) => {
      const originalPrice = product.productId.price;
      const discount = product.productId.discount;
      const discountedPrice = originalPrice - originalPrice * (discount / 100);
      const unitAmount = Math.round(discountedPrice * 100);
      return {
        price_data: {
          currency: currency,
          product_data: {
            name: product.productId.name,
            images: [product.productId.images[0]],
            metadata: {
              productId: product.productId._id.toString(),
              vendorId: product.productId.vendorId.toString(),
              size: product.size,
              color: product.productId.color,
              discount: product.productId.discount,
              brandName: product.productId.brandName,
            },
          },
          unit_amount: unitAmount,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: product.quantity,
      };
    });

    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "required",
      submit_type: "pay",
      customer_email: req.user.email,
      metadata: {
        userId : req.user._id.toString(),
      },
      line_items: lineItems,
      success_url: `${process.env.FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/order/cancelled`,
      shipping_address_collection: {
        allowed_countries: ["IN"], // Allow only India for shipping
      },
    });

    // Store session id 
    if(!session.id) {
      console.log("Error Session id not found");
      return;   
    }
    session_id += session.id;


    res.status(200).json({ id: session.id });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: "Error in stripe checkout " + error.message });
  }
};


// Function for get all product data from line items for to store in order model
const getLineItems = async(lineItems) => {
  let productItems = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await stripe.products.retrieve(item.price.product);
      const productId = product.metadata.productId;
      const vendorId = product.metadata.vendorId;
      const size = product.metadata.size;
      const color = product.metadata.color;
      const discount = product.metadata.discount;
      const brandName = product.metadata.brandName;

      // Product Data
      const productData = {
        productId: productId,
        vendorId: vendorId,
        name: product.name,
        price: item.price.unit_amount / 100,
        quantity: item.quantity,
        image: product.images,
        size: size,
        color: color,
        discount: discount,
        brandName: brandName,
      }

      // Push Data
      productItems.push(productData);
    }
  }

  return productItems;
}


// Stripe Webhook
const stripeWebhook = async (req, res) => {
  try {
    const sig = req.headers["stripe-signature"];

    // Convert req.body in string
    const payloadString = JSON.stringify(req.body);
    
    // Set header
    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: endpointSecret,
    });
    
    let event;

    try {
      event = stripe.webhooks.constructEvent(payloadString, header, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;

        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

          // Fetch product details from function create above
          const productDetails = await getLineItems(lineItems);
          
          // Store data for order create 
          const orderDetails = {
            productDetails : productDetails,
            email : session.customer_email,
            userId : session.metadata.userId,
            paymentDetails: {
              paymentId: session.payment_intent,
              payment_method_type: session.payment_method_types,
              payment_status: session.payment_status,
            },
            shipping_options: session.shipping_options.map(s => {
              return {
                ...s,
                shipping_amount : s.shipping_amount / 100
              }
            }),
            totalAmount: session.amount_total / 100,
            sessionId : session_id,
            billing_details : {},
          };

          // Create new Order
          const order = new OrderModel(orderDetails);
          // Save order
          await order.save();

        } catch (err) {
          console.error('Error retrieving line items:', err.message);
        }
        break;

      case 'charge.updated':
      const charge = event.data.object;
      try {
        // fetch receipt url from charge
        const receiptUrl = charge.receipt_url;
        if (!receiptUrl) {
          console.log("Error : Receipt url is null. ⛔");
          }
          
          if (!session_id) {
            console.log("Error : Session Id is null. ⛔");
        }
        
        // Update the order || receipt and billing details
        const updateOrder = await OrderModel.findOne({sessionId: session_id});
        if (!updateOrder) {
          console.error('Order not found with sessionId:', session_id);
          return res.status(404).json({ error: 'Order not found' });
        }
        updateOrder.receipt_url = receiptUrl || updateOrder.receipt_url;
        updateOrder.billing_details = charge.billing_details || updateOrder.billing_details;
        updateOrder.paymentDetails.brand = charge.payment_method_details.card.brand || updateOrder.paymentDetails.brand;
        updateOrder.paymentDetails.last4Digit = charge.payment_method_details.card.last4 || updateOrder.paymentDetails.last4Digit;
        await updateOrder.save();

        // Recet session ID
        session_id = '';  

      } catch (err) {
        console.error('Error updating order with receipt URL:', err.message);
      }
      break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send();
  } catch (error) {
    console.error('Webhook Error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};


export { stripeCheckout, stripeWebhook };
