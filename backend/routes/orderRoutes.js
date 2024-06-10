import express from 'express';
import protectRoute from '../middleware/protectRoute.js'
import { getOrders, getOrdersById, getOrdersBySessionId, getVenderOrderById, getVendorOrders } from '../controllers/orderController.js';
import verifyBusinessAccount from '../middleware/isBusinessAccount.js';
const router = express.Router();

router.get('/vendor-orders', protectRoute, verifyBusinessAccount, getVendorOrders);
router.get('/get-orders', protectRoute, getOrders);
router.get('/:orderId', protectRoute, getOrdersById);
router.get('/sessionId/:sessionId', protectRoute, getOrdersBySessionId);
router.get('/vendor/:orderId', protectRoute, verifyBusinessAccount, getVenderOrderById);

export default router;