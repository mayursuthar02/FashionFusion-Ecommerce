import express from 'express';
import protectRoute from '../middleware/protectRoute.js'
import { createOrder, getOrderById } from '../controllers/orderController.js';
const router = express.Router();

router.post('/create-order', protectRoute, createOrder);
router.get('/:orderId', protectRoute, getOrderById);

export default router;