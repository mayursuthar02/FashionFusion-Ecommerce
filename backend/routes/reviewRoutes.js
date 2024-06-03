import express from 'express';
import protectRoute from '../middleware/protectRoute.js'
import { createReview, getProductReview } from '../controllers/reviewController.js';
const router = express.Router();

router.post('/create', protectRoute, createReview);
router.get('/by-product/:productId', getProductReview);

export default router;