import { Request, Response } from 'express';
import { z } from 'zod';
import pino from 'pino';

import { UserClientService } from '../../application/service/UserClientService.js';
import { PrismaUserRepository } from '../../../User/infra/repositories/PrismaUserRepository.js';
import { PrismaClientRepository } from '../repositories/PrismaClientRepository.js';
import { AppError } from '../../../../shared/types/AppError.js';
import { FileStorageRepository } from '../../../../shared/infra/storage/FileStorageRepository.js';
import { IUpdateClientDTO } from '../../application/dtos/IUpdateClientDTO.js';

const logger = pino();

const ZClientSchema = z.string().nonempty({ message: 'Nome é obrigatório' });
const ZIdSchema = z.string().min(30, { message: 'ID é obrigatório' });

const ZUpdateClientSchema = z
  .object({
    name: z.string().nonempty({ message: 'Nome não pode ser vazio' }),
    email: z.email({ message: 'Email inválido' }).nonempty({ message: 'Email não pode ser vazio' }),
    phone: z.string().nonempty({ message: 'Telefone não pode ser vazio' }),
  })
  .partial() // aceita ausência (undefined)
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'Informe ao menos um campo para atualizar',
  });

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

  public async read(req: Request, res: Response): Promise<Response> {
    const paramsId = req.params.id as string;
    const userId = req.tokenUserId;

    const validation = ZIdSchema.safeParse(paramsId);
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
      const result = await userClientService.read(paramsId, userId);
      if (!result.ok) {
        const { statusCode } = result.error as AppError;
        if (statusCode >= 500) logger.error(result.error.message);
        const message =
          statusCode >= 500 ? 'Erro interno. Contate o suporte.' : result.error.message;
        return res.status(statusCode).json({ message });
      }

      return res.json({
        message: 'Cliente encontrado.',
        data: result.value,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'Erro interno. Contate o suporte.' });
    }
  }

  public async listAll(req: Request, res: Response): Promise<Response> {
    const userId = req.tokenUserId;
    let page = Number(req.query.page);
    const search = req.query.search ? String(req.query.search) : undefined;

    if (!page || page <= 0 || isNaN(page)) {
      page = 1;
    }

    const validation = ZIdSchema.safeParse(userId);
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
      const result = await userClientService.listAll(userId, page, search);
      if (!result.ok) {
        const statusCode = (result.error as AppError)?.statusCode ?? 500;
        if (statusCode >= 500) logger.error(result.error);
        const message =
          statusCode >= 500
            ? 'Erro interno. Contate o suporte.'
            : ((result.error as AppError).message ?? 'Erro');
        return res.status(statusCode).json({ message });
      }
      return res.json({
        message: 'Clientes encontrados.',
        data: result.value,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'Erro interno. Contate o suporte.' });
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const paramsId = req.params.id as string;
    const userId = req.tokenUserId;
    const data = req.body as IUpdateClientDTO;

    if (!userId) return res.status(401).json({ message: 'Não autorizado.' });

    const validationData = ZUpdateClientSchema.safeParse(data);
    if (!validationData.success) {
      return res.status(400).json({
        message: 'Dados Inválidos.',
        error: validationData.error.issues,
      });
    }

    const validData = validationData.data as IUpdateClientDTO;

    const userRepository = new PrismaUserRepository();
    const clientRepository = new PrismaClientRepository();
    const fileStorage = new FileStorageRepository(['assets', 'files']);
    const userClientService = new UserClientService(userRepository, clientRepository, fileStorage);

    try {
      const result = await userClientService.update(paramsId, userId, validData);
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
        message: 'Atualizado com sucesso!',
        data: result.value,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'Erro interno. Contate o suporte.' });
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const paramsId = req.params.id as string;
    const userId = req.tokenUserId;

    if (!userId) return res.status(401).json({ message: 'Não autorizado.' });

    const validation = ZIdSchema.safeParse(paramsId);
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
      const result = await userClientService.delete(paramsId, userId);
      if (!result.ok) {
        const { statusCode } = result.error as AppError;

        if (statusCode >= 500) {
          logger.error({ userId: paramsId }, result.error.message);
        }

        const message =
          statusCode >= 500 ? 'Erro interno. Contate o suporte.' : result.error.message;

        return res.status(statusCode).json({ message });
      }

      return res.json({
        message: `Cliente ${result.value.name} deletado com sucesso!`,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ message: 'Erro interno. Contate o suporte.' });
    }
  }
}

export const userClientController = new UserClientController();
