import express from 'express';
import protectRoute from '../middleware/protectRoute.js'
import { getOrders } from '../controllers/orderController.js';
const router = express.Router();

router.get('/get-orders', protectRoute, getOrders);

export default router;