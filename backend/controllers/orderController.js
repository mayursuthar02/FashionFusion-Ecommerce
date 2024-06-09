import OrderModel from "../models/OrderModel.js";

const getOrders = async(req,res) => {
    try {
        const userId = req.user._id;

        const order = await OrderModel.find({userId});

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

export { getOrders };
