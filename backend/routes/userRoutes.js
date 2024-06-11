import express from 'express';
import { AddInWishlist, SignupUser, UpdateUserProfile, loginUser, logoutUser } from '../controllers/userController.js';
import protectRoute from '../middleware/protectRoute.js'
const router = express.Router();

router.post('/signup', SignupUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/update-profile', protectRoute, UpdateUserProfile);
router.post('/add-wishlist', protectRoute, AddInWishlist);

export default router;