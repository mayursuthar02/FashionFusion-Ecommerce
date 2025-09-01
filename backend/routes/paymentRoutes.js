import express from 'express';
import bodyParser from "body-parser";
import protectRoute from '../middleware/protectRoute.js'
import { stripeCheckout, stripeWebhook } from '../controllers/paymentController.js';
const router = express.Router();

router.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }), // ✅ keep this!
  stripeWebhook
);
router.post('/stripe/checkout', protectRoute, express.json(), stripeCheckout);

export default router;