import { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase.js';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';

class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const userRepository = new PrismaUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

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
      const user = await createUserUseCase.execute({
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
}

export const userController = new UserController();
