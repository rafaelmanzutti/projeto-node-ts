import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { UserUseCase } from '../../application/use-cases/UserUseCase.js';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';

class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const userRepository = new PrismaUserRepository();
    const userUseCase = new UserUseCase(userRepository);

    try {
      const ZUserSchema = z.object({
        name: z.string().optional(),
        email: z.email({ message: 'Email é obrigatório' }),
        password: z
          .string({ error: 'Senha é obrigatória' })
          .min(8, { message: 'Senha deve conter no minimo 8 caracteres' }),
      });
      ZUserSchema.parse({ name, email, password });
      console.log(name, email, password);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          message: 'Dados Inválidos.',
          error: err.issues,
        });
      }
    }

    try {
      const user = await userUseCase.create({
        name,
        email,
        password,
      });
      return res.json({
        message: 'Criado com Sucesso.',
        data: user,
      });
    } catch (err) {
      return res.status(409).json({
        message: (err as Error).message,
      });
    }
  }

  public async read(req: Request, res: Response): Promise<Response> {
    const paramsId = req.params.id as string;
    const userRepository = new PrismaUserRepository();
    const userUseCase = new UserUseCase(userRepository);

    try {
      const ZIdSchema = z.string().min(30, { message: 'ID é obrigatório' });
      ZIdSchema.parse(paramsId);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: 'Dados Inválidos.',
          error: error.issues,
        });
      }
    }

    try {
      const user = await userUseCase.read(paramsId);
      if (!user) {
        return res.status(404).json({
          message: 'Usuário não encontrado.',
        });
      }
      return res.json({
        message: 'Usuário encontrado.',
        data: user,
      });
    } catch {
      return res.status(500).json({
        message: 'Erro interno do servidor.',
      });
    }
  }
}

export const userController = new UserController();
