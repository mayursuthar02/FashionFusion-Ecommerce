import express from 'express';
import { createProduct, getVenderProducts, updateProduct } from '../controllers/productController.js';
import protectRoute from '../middleware/protectRoute.js'
import verifyBusinessAccount from '../middleware/isBusinessAccount.js';
const router = express.Router();

router.post('/create', protectRoute, verifyBusinessAccount, createProduct);
router.get('/vendor', protectRoute, verifyBusinessAccount, getVenderProducts);
router.put('/update/:id', protectRoute, verifyBusinessAccount, updateProduct);

export default router;