import { Request, Response } from 'express';
import { z } from 'zod';
import pino from 'pino';

import { UserClientService } from '../../application/service/UserClientService.js';
import { PrismaUserRepository } from '../../../User/infra/repositories/PrismaUserRepository.js';
import { PrismaClientRepository } from '../repositories/PrismaClientRepository.js';
import { AppError } from '../../../../shared/types/AppError.js';
import { FileStorageRepository } from '../../../../shared/infra/storage/FileStorageRepository.js';

const logger = pino();

const ZClientSchema = z.string().min(1, { message: 'Nome é obrigatório' });

// const ZIdSchema = z.string().min(30, { message: 'ID é obrigatório' });

// const ZIdNameSchema = z.object({
//   paramsId: z.string().min(30, { message: 'ID é obrigatório' }),
//   name: z.string().min(1, { message: 'Nome é obrigatório' }),
// });

class UserClientController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, phone } = req.body;
    const userId = req.tokenUserId;

    const validation = ZClientSchema.safeParse(name);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Dados Inválidos.',
        error: validation.error.issues,
      });
    }

    const userRepository = new PrismaUserRepository();
    const clientRepository = new PrismaClientRepository();
    const fileStorage = new FileStorageRepository(['assets', 'files']);
    const userClientService = new UserClientService(userRepository, clientRepository, fileStorage);

    try {
      const result = await userClientService.create({ userId, name, email, phone });
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
        message: 'Criado com Sucesso.',
        data: result.value,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'Erro interno. Contate o suporte.' });
    }
  }

  // public async read(req: Request, res: Response): Promise<Response> {
  //   const paramsId = req.params.id as string;

  //   const validation = ZIdSchema.safeParse(paramsId);
  //   if (!validation.success) {
  //     return res.status(400).json({
  //       message: 'Dados Inválidos.',
  //       error: validation.error.issues,
  //     });
  //   }

  //   const userRepository = new PrismaUserRepository();
  //   const userService = new UserService(userRepository);

  //   try {
  //     const user = await userService.read(paramsId);
  //     if (!user) {
  //       return res.status(404).json({ message: 'Usuário não encontrado.' });
  //     }

  //     return res.json({
  //       message: 'Usuário encontrado.',
  //       data: user,
  //     });
  //   } catch (error) {
  //     logger.error(error);
  //     return res.status(500).json({ message: 'Erro interno. Contate o suporte.' });
  //   }
  // }

  // public async listAll(req: Request, res: Response): Promise<Response> {
  //   const paramsId = req.params.id as string;

  //   const validation = ZIdSchema.safeParse(paramsId);
  //   if (!validation.success) {
  //     return res.status(400).json({
  //       message: 'Dados Inválidos.',
  //       error: validation.error.issues,
  //     });
  //   }

  //   const userRepository = new PrismaUserRepository();
  //   const userService = new UserService(userRepository);

  //   try {
  //     const user = await userService.read(paramsId);
  //     if (!user) {
  //       return res.status(404).json({ message: 'Usuário não encontrado.' });
  //     }

  //     return res.json({
  //       message: 'Usuário encontrado.',
  //       data: user,
  //     });
  //   } catch (error) {
  //     logger.error(error);
  //     return res.status(500).json({ message: 'Erro interno. Contate o suporte.' });
  //   }
  // }

  // public async update(req: Request, res: Response): Promise<Response> {
  //   const { name } = req.body;
  //   const paramsId = req.params.id as string;

  //   const validationId = ZIdNameSchema.safeParse({ paramsId, name });
  //   if (!validationId.success) {
  //     return res.status(400).json({
  //       message: 'Dados Inválidos.',
  //       error: validationId.error.issues,
  //     });
  //   }

  //   const userRepository = new PrismaUserRepository();
  //   const userService = new UserService(userRepository);

  //   try {
  //     const result = await userService.update(paramsId, name);
  //     if (!result.ok) {
  //       const { statusCode } = result.error as AppError;

  //       if (statusCode >= 500) {
  //         logger.error(result.error.message);
  //       }

  //       const message =
  //         statusCode >= 500 ? 'Erro interno. Contate o suporte.' : result.error.message;
  //       return res.status(statusCode).json({ message });
  //     }

  //     return res.json({
  //       message: 'Atualizado com sucesso!',
  //       data: result.value,
  //     });
  //   } catch (error) {
  //     logger.error(error);
  //     return res.status(500).json({ message: 'Erro interno. Contate o suporte.' });
  //   }
  // }

  // public async delete(req: Request, res: Response): Promise<Response> {
  //   const paramsId = req.params.id as string;

  //   const validation = ZIdSchema.safeParse(paramsId);
  //   if (!validation.success) {
  //     return res.status(400).json({
  //       message: 'Dados Inválidos.',
  //       error: validation.error.issues,
  //     });
  //   }

  //   const userRepository = new PrismaUserRepository();
  //   const userService = new UserService(userRepository);

  //   try {
  //     const result = await userService.delete(paramsId);
  //     if (!result.ok) {
  //       const { statusCode } = result.error as AppError;

  //       if (statusCode >= 500) {
  //         logger.error({ userId: paramsId }, result.error.message); // só aparece no terminal do servidor
  //       }

  //       const message =
  //         statusCode >= 500 ? 'Erro interno. Contate o suporte.' : result.error.message;

  //       return res.status(statusCode).json({ message });
  //     }

  //     return res.json({
  //       message: 'Usuário deletado com sucesso!',
  //     });
  //   } catch (error) {
  //     logger.error(error);
  //     return res.status(500).json({ message: 'Erro interno. Contate o suporte.' });
  //   }
  // }
}

export const userClientController = new UserClientController();
