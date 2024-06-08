import OrderModel from "../models/OrderModel.js";

const createOrder = async (req, res) => {
  try {
    const { products, sessionId } = req.body;
    const userId = req.user._id;
    
    const existsOrder = await OrderModel.findOne({stripeSessionId: sessionId});
    if (existsOrder) {
        return res.status(200).json(existsOrder);
    }

    const vendorIds = products.map((product) => product.productId.vendorId);
    const orderProducts = products.reduce((accumulator, product) => {
      accumulator.push({
        productId: product.productId._id,
        quantity: product.quantity,
      });
      return accumulator;
    }, []);
    const totalPrice = products.reduce((total, product) => {
      const originalPrice = product.productId.price;
      const discount = product.productId.discount;
      const discountedPrice = originalPrice - originalPrice * (discount / 100);
      const totalPriceForProduct = discountedPrice * product.quantity;
      return total + totalPriceForProduct;
    }, 0);

    const newOrder = new OrderModel({
      userId,
      vendorId: vendorIds,
      products: orderProducts,
      totalPrice,
      stripeSessionId: sessionId,
    });

    await newOrder.save();

    res.status(200).json(newOrder);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ error: "Error in create order " + error.message });
  }
};

const getOrderById = async(req,res) => {
    try {
        const {orderId} = req.params;
        const userId = req.user._id;

        const order = await OrderModel.findOne({_id: orderId, userId})
        .populate({
            path: 'products.productId',
            select: '_id category subCategory name images color discount price vendorId brandName',
        });

        if (!order) {
            return res.status(404).json({error: "Order not found"});
        }

        res.status(200).json(order);
    } catch (error) {
        console.log(error.message);
        res
          .status(500)
          .json({ error: "Error in get order " + error.message });
    }
}

export { createOrder, getOrderById};
