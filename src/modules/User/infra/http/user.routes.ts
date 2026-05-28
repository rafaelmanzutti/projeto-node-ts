import { Router } from 'express';
import { AuthMiddleware } from '../../../../middleware/authMiddleware.js';
import { userController } from './UserController.js';

const router = Router();
const baseUrl = '/user';

router.post(`${baseUrl}`, (req, res) => userController.create(req, res));

router.use(`${baseUrl}/:id`, AuthMiddleware.authenticate);
router.get(`${baseUrl}/:id`, (req, res) => userController.read(req, res));
router.patch(`${baseUrl}/:id`, (req, res) => userController.update(req, res));
router.delete(`${baseUrl}/:id`, (req, res) => userController.delete(req, res));

export const userRouter = router;
