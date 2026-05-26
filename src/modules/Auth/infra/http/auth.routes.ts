import { Router } from 'express';
import { authController } from './AuthController.js';

const router = Router();
const baseUrl = '/auth';

router.post(`${baseUrl}/login`, (req, res) => authController.login(req, res));
router.post(`${baseUrl}/token`, (req, res) => authController.token(req, res));

export const authRouter = router;
