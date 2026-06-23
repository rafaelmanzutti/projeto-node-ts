import { Router } from 'express';
import { AuthMiddleware } from '../../../../middleware/authMiddleware.js';
import { userClientController } from './UserClientController.js';

const router = Router();
const baseUrl = '/user-client';

router.use(`${baseUrl}`, AuthMiddleware.authenticate);
router.post(`${baseUrl}`, (req, res) => userClientController.create(req, res));
router.get(`${baseUrl}`, (req, res) => userClientController.listAll(req, res));
router.get(`${baseUrl}/:id`, (req, res) => userClientController.read(req, res));
router.patch(`${baseUrl}/:id`, (req, res) => userClientController.update(req, res));
router.delete(`${baseUrl}/:id`, (req, res) => userClientController.delete(req, res));

export const userClientRouter = router;
