import express from 'express';
import { SignupUser, UpdateUserProfile, loginUser } from '../controllers/userController.js';
import protectRoute from '../middleware/protectRoute.js'
const router = express.Router();

router.post('/signup', SignupUser);
router.post('/login', loginUser);
router.put('/update-profile', protectRoute, UpdateUserProfile);

export default router;