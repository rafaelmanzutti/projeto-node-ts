import { Router } from 'express';
import { userController } from './controller/user-controller.js';

const router = Router();
const baseUrl = '/user';

router.post(`${baseUrl}/create`, userController.create);
router.get(`${baseUrl}/read`, userController.read);

export const userRouter = router;
