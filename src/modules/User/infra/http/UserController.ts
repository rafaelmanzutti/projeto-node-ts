import { Request, Response } from 'express';
import { z } from 'zod';
import { UserService } from '../../application/service/UserService.js';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';

const ZUserSchema = z.object({
  name: z.string().optional(),
  email: z.email({ message: 'Email é obrigatório' }),
  password: z
    .string({ error: 'Senha é obrigatória' })
    .min(8, { message: 'Senha deve conter no minimo 8 caracteres' }),
});

const ZIdSchema = z.string().min(30, { message: 'ID é obrigatório' });

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
      return res.status(409).json({ message: result.error.message });
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
}

export const userController = new UserController();
