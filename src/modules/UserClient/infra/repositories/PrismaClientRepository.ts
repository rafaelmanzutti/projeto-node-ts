import { prisma } from '../../../../shared/infra/database/prisma.js';
//import { IUpdateUserDTO } from '../../application/dtos/IUpdateUserDTO.js';
import { IClientRepository } from '../../domain/IClientRepository.js';
import { IClient } from '../../domain/Client.js';

export class PrismaClientRepository implements IClientRepository {
  async create(client: IClient): Promise<IClient> {
    const created = await prisma.userClient.create({
      data: {
        id: client.id,
        userId: client.userId,
        name: client.name,
        email: client.email || null,
        phone: client.phone || null,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      },
    });
    return created;
  }

  async findByIdUserId(paramsId: string, userId: string): Promise<IClient | null> {
    const client = await prisma.userClient.findUnique({
      where: {
        id: paramsId,
        userId: userId,
      },
    });
    return client as unknown as IClient | null;
  }

  async count(userId: string): Promise<number> {
    return prisma.userClient.count({ where: { userId } });
  }

  async listByUserId(userId: string, skip: number, take: number): Promise<IClient[]> {
    return prisma.userClient.findMany({
      where: { userId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    }) as unknown as IClient[];
  }

  // async update(paramsId: string, data: IUpdateUserDTO): Promise<IUser> {
  //   const updated = await prisma.user.update({
  //     where: {
  //       id: paramsId,
  //     },
  //     data: {
  //       ...data,
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //       email: true,
  //     },
  //   });
  //   return updated as unknown as IUser;
  // }

  async delete(id: string): Promise<IClient | null> {
    const deleted = await prisma.userClient.delete({
      where: { id },
      select: { id: true, name: true, email: true },
    });
    return deleted as unknown as IClient | null;
  }

  // async findByEmail(email: string): Promise<IUser | null> {
  //   const user = await prisma.user.findUnique({
  //     where: { email },
  //     select: { id: true, name: true, email: true },
  //   });
  //   return user as unknown as IUser | null;
  // }

  // async findById(id: string): Promise<IUser | null> {
  //   const user = await prisma.user.findUnique({
  //     where: { id },
  //     select: { id: true, name: true, email: true },
  //   });
  //   return user as unknown as IUser | null;
  // }

  // async findByEmailWithPassword(email: string): Promise<IUser | null> {
  //   const user = await prisma.user.findUnique({
  //     where: { email },
  //     select: { id: true, name: true, email: true, password: true },
  //   });
  //   return user as unknown as IUser | null;
  // }

  // async findByEmailWithResetSecret(email: string): Promise<IUser | null> {
  //   const user = await prisma.user.findUnique({
  //     where: { email },
  //     omit: { password: true },
  //     include: { resetPasswordSecret: true },
  //   });
  //   return user as unknown as IUser | null;
  // }
}
