import express from 'express';
import protectRoute from '../middleware/protectRoute.js'
import { stripeCheckout } from '../controllers/paymentController.js';
const router = express.Router();

router.post('/stripe/checkout', protectRoute, stripeCheckout);

export default router;