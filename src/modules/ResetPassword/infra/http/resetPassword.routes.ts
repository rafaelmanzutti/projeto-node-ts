import { Router } from 'express';
import { resetPasswordController } from './ResetPasswordController.js';

const router = Router();
const baseUrl = '/reset-password';

router.post(`${baseUrl}`, (req, res) => resetPasswordController.validateUser(req, res));
router.post(`${baseUrl}/validate`, (req, res) =>
  resetPasswordController.validateSecurityCode(req, res),
);
router.patch(`${baseUrl}`, (req, res) => resetPasswordController.resetPassword(req, res));

export const resetPasswordRouter = router;
