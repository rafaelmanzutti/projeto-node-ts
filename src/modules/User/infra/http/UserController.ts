import { Request, Response } from 'express';
import { z } from 'zod';
import pino from 'pino';

import { UserService } from '../../application/service/UserService.js';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';
import { AppError } from '../../../../shared/types/AppError.js';

const logger = pino();

const ZUserSchema = z.object({
  name: z.string().optional(),
  email: z.email({ message: 'Email é obrigatório' }),
  password: z
    .string({ error: 'Senha é obrigatória' })
    .min(8, { message: 'Senha deve conter no minimo 8 caracteres' }),
});

const ZIdSchema = z.string().min(30, { message: 'ID é obrigatório' });

const ZIdNameSchema = z.object({
  paramsId: z.string().min(30, { message: 'ID é obrigatório' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
});

class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const validation = ZUserSchema.safeParse({ name, email, password });
    if (!validation.success) {
      return res.status(400).json({
        message: 'Dados Inválidos.',
        error: validation.error.issues,
      });
    }

    const userRepository = new PrismaUserRepository();
    const userService = new UserService(userRepository);

    const result = await userService.create({ name, email, password });
    if (!result.ok) {
      const { statusCode } = result.error as AppError;

      if (statusCode >= 500) {
        logger.error(result.error.message);
      }

      const message = statusCode >= 500 ? 'Erro interno. Contate o suporte.' : result.error.message;
      return res.status(statusCode).json({ message });
    }

    return res.json({
      message: 'Criado com Sucesso.',
      data: result.value,
    });
  }

  public async read(req: Request, res: Response): Promise<Response> {
    const paramsId = req.params.id as string;

    const validation = ZIdSchema.safeParse(paramsId);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Dados Inválidos.',
        error: validation.error.issues,
      });
    }

    const userRepository = new PrismaUserRepository();
    const userService = new UserService(userRepository);

    const user = await userService.read(paramsId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.json({
      message: 'Usuário encontrado.',
      data: user,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;
    const paramsId = req.params.id as string;

    const validationId = ZIdNameSchema.safeParse({ paramsId, name });
    if (!validationId.success) {
      return res.status(400).json({
        message: 'Dados Inválidos.',
        error: validationId.error.issues,
      });
    }

    const userRepository = new PrismaUserRepository();
    const userService = new UserService(userRepository);

    const result = await userService.update(paramsId, name);
    if (!result.ok) {
      const { statusCode } = result.error as AppError;

      if (statusCode >= 500) {
        logger.error(result.error.message);
      }

      const message = statusCode >= 500 ? 'Erro interno. Contate o suporte.' : result.error.message;
      return res.status(statusCode).json({ message });
    }

    return res.json({
      message: 'Atualizado com sucesso!',
      data: result.value,
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const paramsId = req.params.id as string;

    const validation = ZIdSchema.safeParse(paramsId);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Dados Inválidos.',
        error: validation.error.issues,
      });
    }

    const userRepository = new PrismaUserRepository();
    const userService = new UserService(userRepository);

    const result = await userService.delete(paramsId);
    if (!result.ok) {
      const { statusCode } = result.error as AppError;

      if (statusCode >= 500) {
        logger.error({ userId: paramsId }, result.error.message); // só aparece no terminal do servidor
      }

      const message = statusCode >= 500 ? 'Erro interno. Contate o suporte.' : result.error.message;

      return res.status(statusCode).json({ message });
    }

    return res.json({
      message: 'Usuário deletado com sucesso!',
    });
  }
}

export const userController = new UserController();
