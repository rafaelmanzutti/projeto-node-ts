import { prisma } from '../../../../shared/infra/database/prisma.js';
import { IUserRepository } from '../../domain/IUserRepository.js';
import { IUser } from '../../domain/User.js';

export class PrismaUserRepository implements IUserRepository {
  async create(user: IUser): Promise<IUser> {
    const created = await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return created as unknown as IUser;
  }

  async update(paramsId: string, name: string): Promise<IUser> {
    const updated = await prisma.user.update({
      where: {
        id: paramsId,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return updated as unknown as IUser;
  }

  async delete(id: string): Promise<IUser | null> {
    const deleted = await prisma.user.delete({
      where: { id },
      select: { id: true, name: true, email: true },
    });
    return deleted as unknown as IUser;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });
    return user as unknown as IUser | null;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true },
    });
    return user as unknown as IUser | null;
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });
    return user as unknown as IUser | null;
  }
}
