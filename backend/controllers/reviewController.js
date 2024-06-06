import ReviewModel from '../models/ReviewModel.js';
import productModel from '../models/ProductModel.js';

const createReview = async(req,res) => {
    try {
        const {productId, rating, text, vendorId} = req.body;
        const userId = req.user._id;
        
        const newReview = new ReviewModel({
            userId,
            vendorId,
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

const getVenderProductReviews = async(req, res) => {
    try {
        const vendorId = req.user._id;
        const reviews = await ReviewModel.find({vendorId})
        .sort({createdAt: -1})
        .populate({path: 'userId', select: "_id fullName businessName profilePic"})
        .populate({path: 'productId', select: "_id category subCategory name images"})
        if (!reviews) {
            return res.status(400).json({error: "Reviews not found."});
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in get vender product reviews "+error.message});
    }
}

const deleteReview = async(req,res) => {
    try {
        const {reviewId, productId} = req.body;

        const deleteReviews = await ReviewModel.findByIdAndDelete(reviewId);
        if (!deleteReviews) {
            return res.status(404).json({error: "Review not found"});
        }        
        
        const updateProduct = await productModel.findById(productId);
        if (!updateProduct) {
            return res.status(404).json({error: "product not found"});
        }
        
        if (updateProduct.reviews.includes(reviewId)) {
            updateProduct.reviews = updateProduct.reviews.filter(id => id.toString() !== reviewId.toString());
            await updateProduct.save();
        }

        res.status(200).json({ message: "Review deleted successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: "Error in delete review "+error.message});
    }
};

export {
    createReview, 
    getProductReview,
    getVenderProductReviews,
    deleteReview
};