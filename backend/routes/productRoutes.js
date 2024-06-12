import express from 'express';
import { createProduct, deleteProduct, getAllProduct, getFilterProducts, getFilterProperties, getProductByName, getProductDetails, getVenderProducts, searchProductV1, searchProductV2, updateProduct } from '../controllers/productController.js';
import protectRoute from '../middleware/protectRoute.js'
import verifyBusinessAccount from '../middleware/isBusinessAccount.js';
const router = express.Router();

router.post('/create', protectRoute, verifyBusinessAccount, createProduct);
router.get('/vendor', protectRoute, verifyBusinessAccount, getVenderProducts);
router.put('/update/:id', protectRoute, verifyBusinessAccount, updateProduct);
router.delete('/delete/:id', protectRoute, verifyBusinessAccount, deleteProduct);

router.get('/get-product-details/:id', getProductDetails);
router.get('/get-product/:name', getProductByName);
router.get('/filter-properties', getFilterProperties);
router.post('/get-filter-product', getFilterProducts);
router.get('/get-all-product', getAllProduct);
router.get('/v1/search/:query', searchProductV1);
router.get('/v2/search', searchProductV2);


export default router;