import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js'; 
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import connectDB from './db/connectDB.js';
import {v2 as cloudinary} from 'cloudinary';

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

app.use('/api/payments', paymentRoutes);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: 'https://fashion-fusion-ecommerce-ten.vercel.app',
  credentials: true
}));
app.use(cookieParser());
app.set('trust proxy', 1);


// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);


// Server Listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> {
    console.log(`Server listen on port : ${PORT}`);
});
