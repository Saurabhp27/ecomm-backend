import express from 'express'
import { Router } from 'express'
import { registerUser, loginUser, getPublicKey } from '../controller/userController.js';

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/publicKey", getPublicKey);
export default router;

