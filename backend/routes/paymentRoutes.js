import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { stripeCheckout } from '../controllers/paymentController.js';

const router = express.Router();

// Webhook is mounted at app-level in server.js — DO NOT add it here
router.post('/stripe/checkout', protectRoute, stripeCheckout);

export default router;
