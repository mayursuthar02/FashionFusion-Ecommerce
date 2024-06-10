import OrderModel from "../models/OrderModel.js";


const getVendorOrders = async(req,res) => {
    try {
        const vendorId = req.user._id;
        
        const orders = await OrderModel.aggregate([
            { $unwind: "$productDetails" },
            { $match: { "productDetails.vendorId": vendorId.toString() } },
            {
                $lookup: {
                    from: "users", // Ensure this matches the name of the User collection
                    let: { userId: { $toObjectId: "$userId" } },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
                        { $project: { _id: 1, fullName: 1, businessName: 1, profilePic: 1 } }
                    ],
                    as: "userDetails"
                }
            },
            {
                $addFields: {
                    userDetails: { $arrayElemAt: ["$userDetails", 0] } // Convert userDetails array to object
                }
            },
            {
                $group: {
                    _id: "$_id",
                    productDetails: { $push: "$productDetails" },
                    email: { $first: "$email" },
                    userId: { $first: "$userId" },
                    userDetails: { $first: "$userDetails" },
                    paymentDetails: { $first: "$paymentDetails" },
                    status: { $first: "$status" },
                    shipping_options: { $first: "$shipping_options" },
                    totalAmount: { $first: "$totalAmount" },
                    receipt_url: { $first: "$receipt_url" },
                    sessionId: { $first: "$sessionId" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    billing_details: { $first: "$billing_details" }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        if (!orders) {
            return res.status(404).json({ error: "Orders not found" });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.log(error.message);
        res
          .status(500)
          .json({ error: "Error in get order " + error.message });
    }
}

const getOrders = async(req,res) => {
    try {
        const userId = req.user._id;

        const order = await OrderModel.find({userId}).sort({createdAt: -1});

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

const getOrdersById = async(req,res) => {
    try {
        const {orderId} = req.params;

        const order = await OrderModel.findById(orderId);
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

const getOrdersBySessionId = async(req,res) => {
    try {
        const {sessionId} = req.params;

        const order = await OrderModel.findOne({sessionId});
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

const getVenderOrderById = async(req,res) => {
    try {
        const {orderId} = req.params;

        const order = await OrderModel.findById(orderId).populate({path: "userId", select: "_id fullName businessName profilePic"});
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

export { 
    getOrders,
    getOrdersById,
    getOrdersBySessionId,
    getVendorOrders,
    getVenderOrderById
};

