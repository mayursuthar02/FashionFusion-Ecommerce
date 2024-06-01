import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'; 
import connectDB from './db/connectDB.js';

dotenv.config();

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());
app.use(cookieParser());


// Routes
app.use('/api/users', userRoutes);


// Server Listen
const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=> {
    console.log(`Server listen on port : ${PORT}`);
});
