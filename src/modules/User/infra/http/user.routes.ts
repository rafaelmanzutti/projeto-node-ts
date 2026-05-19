import { Router } from 'express';
import { userController } from './UserController.js';

const router = Router();
const baseUrl = '/user';

router.post(`${baseUrl}`, (req, res) => userController.create(req, res));

router.get(`${baseUrl}/:id`, (req, res) => userController.read(req, res));

router.patch(`${baseUrl}/:id`, (req, res) => userController.update(req, res));

export const userRouter = router;
