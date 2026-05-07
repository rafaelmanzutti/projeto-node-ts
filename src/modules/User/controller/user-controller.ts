import { Request, Response } from 'express';
import { prisma } from '../../../db/prisma.js';

class UserController {
  public async create(req: Request, res: Response) {
    await prisma.user.create({
      data: {
        email: 'manzutti@gmail.com',
        name: 'Rafael Manzutti',
      },
    });
    return res.json({
      data: 'Criado com sucesso!',
    });
  }

  public read(req: Request, res: Response) {
    return res.json({
      data: 'Hello World!',
    });
  }
}

export const userController = new UserController();
