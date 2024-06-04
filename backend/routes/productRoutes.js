import express from 'express';
import { createProduct, getCategoryProduct, getProductByName, getProductDetails, getVenderProducts, updateProduct } from '../controllers/productController.js';
import protectRoute from '../middleware/protectRoute.js'
import verifyBusinessAccount from '../middleware/isBusinessAccount.js';
const router = express.Router();

router.post('/create', protectRoute, verifyBusinessAccount, createProduct);
router.get('/vendor', protectRoute, verifyBusinessAccount, getVenderProducts);
router.put('/update/:id', protectRoute, verifyBusinessAccount, updateProduct);
router.get('/get-product-details/:id', getProductDetails);
router.get('/get-product/:name', getProductByName);
router.post('/get-category-product', getCategoryProduct);

export default router;