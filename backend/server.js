import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/userRoutes.js'; 
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import connectDB from './db/connectDB.js';
import {v2 as cloudinary} from 'cloudinary';
import { stripeWebhook } from './controllers/paymentController.js';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Database Connection
connectDB();

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})



// CORS & cookies (safe before webhook; they don't parse body)
const corsOptions = {
  origin: 'https://fashion-fusion-ecommerce-ten.vercel.app',
  // origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.set('trust proxy', 1);

/* ================================
   1) STRIPE WEBHOOK — mount FIRST
   Must use RAW body and BEFORE express.json()
================================ */
app.post(
  '/api/payments/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

/* ================================
   2) JSON parsers AFTER webhook
================================ */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

/* ================================
   3) Routes
================================ */
app.options('/api/payments/stripe/checkout', cors(corsOptions), (req, res) => {
  res.sendStatus(200);
});

// Payments router MUST NOT define webhook again
app.use('/api/payments', paymentRoutes);

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);

/* ================================
   4) Serve frontend (optional)
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, 'client/build');
  app.use(express.static(clientPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(clientPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listen on port : ${PORT}`));