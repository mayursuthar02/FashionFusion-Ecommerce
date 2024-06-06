import express from 'express';
import protectRoute from '../middleware/protectRoute.js'
import { createReview, deleteReview, getProductReview, getVenderProductReviews } from '../controllers/reviewController.js';
const router = express.Router();

router.post('/create', protectRoute, createReview);
router.get('/by-product/:productId', getProductReview);
router.get('/get-vender-product-reviews',protectRoute, getVenderProductReviews);
router.post('/delete',protectRoute, deleteReview);

export default router;