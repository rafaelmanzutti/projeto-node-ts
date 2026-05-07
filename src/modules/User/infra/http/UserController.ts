import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase.js';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository.js';

export class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const userRepository = new PrismaUserRepository();
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const user = await createUserUseCase.execute({
      email: req.body.email ?? 'manzutti@gmail.com',
      name: req.body.name ?? 'Rafael Manzutti',
    });

    return res.json({ data: user });
  }

  read(req: Request, res: Response): Response {
    return res.json({ data: 'Hello World!' });
  }
}

export const userController = new UserController();
