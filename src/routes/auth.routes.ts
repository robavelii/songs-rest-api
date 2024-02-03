// src/routes/authRoutes.ts
import express from 'express';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/refresh', authController.refresh);
router.post('/logout', authController.logOut);

export default router;

