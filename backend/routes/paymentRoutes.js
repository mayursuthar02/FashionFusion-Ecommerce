import express from 'express';
import bodyParser from "body-parser";
import protectRoute from '../middleware/protectRoute.js'
import { stripeCheckout, stripeWebhook } from '../controllers/paymentController.js';
const router = express.Router();

router.post('/stripe/checkout', protectRoute, stripeCheckout);
router.post('/stripe/webhook', bodyParser.raw({ type: 'application/json' }), stripeWebhook);

export default router;