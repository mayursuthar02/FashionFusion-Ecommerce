import express from 'express';
import protectRoute from '../middleware/protectRoute.js'
import { createReview, getProductReview, getVenderProductReviews } from '../controllers/reviewController.js';
const router = express.Router();

router.post('/create', protectRoute, createReview);
router.get('/by-product/:productId', getProductReview);
router.get('/get-vender-product-reviews',protectRoute, getVenderProductReviews);

export default router;