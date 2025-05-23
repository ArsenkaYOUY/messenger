import express from 'express';
const router = express.Router();

import {loginUser, registerUser} from '../controllers/authController.js';
import { refreshToken } from "../controllers/refreshController.js";

router.post('/login', loginUser);

router.post('/register', registerUser);

router.post('/refresh', refreshToken)

export default router;