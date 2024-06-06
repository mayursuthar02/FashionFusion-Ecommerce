import express from 'express';
import { createProduct, getAllProduct, getFilterProducts, getFilterProperties, getProductByName, getProductDetails, getVenderProducts, updateProduct } from '../controllers/productController.js';
import protectRoute from '../middleware/protectRoute.js'
import verifyBusinessAccount from '../middleware/isBusinessAccount.js';
const router = express.Router();

router.post('/create', protectRoute, verifyBusinessAccount, createProduct);
router.get('/vendor', protectRoute, verifyBusinessAccount, getVenderProducts);
router.put('/update/:id', protectRoute, verifyBusinessAccount, updateProduct);
router.get('/get-product-details/:id', getProductDetails);
router.get('/get-product/:name', getProductByName);
router.get('/filter-properties', getFilterProperties);
router.post('/get-filter-product', getFilterProducts);
router.get('/get-all-product', getAllProduct);

export default router;