import { Router } from 'express';
import { userController } from './UserController.js';

const router = Router();
const baseUrl = '/user';

router.post(`${baseUrl}`, (req, res) => userController.create(req, res));

//router.get(`${baseUrl}/read`, (req, res) => userController.read(req, res));

export const userRouter = router;
