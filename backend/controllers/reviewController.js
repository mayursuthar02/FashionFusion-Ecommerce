import ReviewModel from '../models/ReviewModel.js';
import productModel from '../models/ProductModel.js';

const createReview = async(req,res) => {
    try {
        const {productId, rating, text} = req.body;
        const userId = req.user._id;
        
        const newReview = new ReviewModel({
            userId,
            productId,
            rating,
            text
        });

        await newReview.save();

        const updateProduct = await productModel.findById(productId);
        if (!updateProduct) {
            return res.status(400).json({error: "Product not found"});
        }

        updateProduct.reviews.push(newReview._id);
        await updateProduct.save();

        res.status(200).json(newReview);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in create review "+error.message});
    }
};

const getProductReview = async(req,res) => {
    try {
        const {productId} = req.params;
        const allReviews = await ReviewModel.find({productId})
        .sort({createdAt: -1})
        .populate({path: 'userId', select: "_id fullName businessName profilePic"});
        if (!allReviews) {
            return res.status(400).json({error: "Reviews not found"});
        }

        res.status(200).json(allReviews);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in get reviews by product id "+error.message});
    }
}

export {createReview, getProductReview};