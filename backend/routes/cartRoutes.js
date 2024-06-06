import express from 'express';
import protectRoute from '../middleware/protectRoute.js'
import { DeleteCart, addToCart, getCartItems, updateQuantity } from '../controllers/cartController.js';
const router = express.Router();

router.post('/add-to-cart', protectRoute, addToCart);
router.get('/get-cart-items', protectRoute, getCartItems);
router.put('/update-quantity', protectRoute, updateQuantity);
router.delete('/delete-cart', protectRoute, DeleteCart);

export default router;