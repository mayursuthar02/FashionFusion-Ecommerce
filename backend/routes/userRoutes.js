import express from 'express';
import { SignupUser, loginUser } from '../controllers/userController.js';
const router = express.Router();

router.post('/signup', SignupUser);
router.post('/login', loginUser);

export default router;