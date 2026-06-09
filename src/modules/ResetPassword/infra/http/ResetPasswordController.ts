import { Request, Response } from 'express';
import { z } from 'zod';
import pino from 'pino';
import { ResetPasswordService } from '../../application/service/ResetPasswordService.js';
import { PrismaUserRepository } from '../../../User/infra/repositories/PrismaUserRepository.js';
import { PrismaResetPasswordSecretRepository } from '../repositories/PrismaResetPasswordSecretRepository.js';
import { AppError } from '../../../../shared/types/AppError.js';

const logger = pino();

class ResetPasswordController {
  async validateUser(req: Request, res: Response): Promise<Response> {
    const email = req.body.email;

    const ZUserSchema = z.email({ message: 'Email é obrigatório' });
    const validation = ZUserSchema.safeParse(email);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Dados Inválidos.',
        error: validation.error.issues,
      });
    }

    const userRepository = new PrismaUserRepository();
    const resetPasswordSecretRepository = new PrismaResetPasswordSecretRepository();
    const resetPasswordService = new ResetPasswordService(
      userRepository,
      resetPasswordSecretRepository,
    );

    try {
      const result = await resetPasswordService.validateUser(email);
      if (!result.ok) {
        const { statusCode } = result.error as AppError;

        if (statusCode >= 500) {
          logger.error(result.error.message);
        }

        const message =
          statusCode >= 500 ? 'Erro interno. Contate o suporte.' : result.error.message;
        return res.status(statusCode).json({ message });
      }

      return res.json({
        message: 'Código enviado por email.',
        data: result.value,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'Erro interno. Contate o suporte.' });
    }
  }
  //async validateSecurityCode(request: Request, response: Response): Promise<void> {}
  //async resetPassword(request: Request, response: Response): Promise<void> {}
}

export const resetPasswordController = new ResetPasswordController();
