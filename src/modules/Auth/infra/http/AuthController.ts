import { Request, Response } from 'express';
import { z } from 'zod';
import pino from 'pino';
import { AuthService } from '../../application/service/AuthService.js';
import { PrismaUserRepository } from '../../../User/infra/repositories/PrismaUserRepository.js';
import { AppError } from '../../../../shared/types/AppError.js';

const logger = pino();

class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const ZAuthSchema = z.object({
      email: z.email({ message: 'Email é obrigatório' }),
      password: z
        .string({ error: 'Senha é obrigatória' })
        .min(8, { message: 'Senha deve conter no minimo 8 caracteres' }),
    });

    const validation = ZAuthSchema.safeParse({ email, password });
    if (!validation.success) {
      return res.status(400).json({
        message: 'Dados Inválidos.',
        error: validation.error.issues,
      });
    }

    const userRepository = new PrismaUserRepository();
    const authService = new AuthService(userRepository);

    const result = await authService.login({ email, password });
    if (!result.ok) {
      const { statusCode } = result.error as AppError;

      if (statusCode >= 500) {
        logger.error(result.error.message);
      }

      const message = statusCode >= 500 ? 'Erro interno. Contate o suporte.' : result.error.message;
      return res.status(statusCode).json({ message });
    }

    return res.json({
      data: result.value,
    });
  }

  async token(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Token de atualização é obrigatório.' });
    }

    const ZTokenSchema = z.string().min(25, { message: 'Token é obrigatório' });

    const validation = ZTokenSchema.safeParse(refreshToken);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Dados Inválidos.',
        error: validation.error.issues,
      });
    }

    const userRepository = new PrismaUserRepository();
    const authService = new AuthService(userRepository);

    const result = await authService.token(refreshToken);
    if (!result.ok) {
      const { statusCode } = result.error as AppError;

      if (statusCode >= 500) {
        logger.error(result.error.message);
      }

      const message = statusCode >= 500 ? 'Erro interno. Contate o suporte.' : result.error.message;
      return res.status(statusCode).json({ message });
    }

    return res.json({
      data: result.value,
    });
  }
}

export const authController = new AuthController();
