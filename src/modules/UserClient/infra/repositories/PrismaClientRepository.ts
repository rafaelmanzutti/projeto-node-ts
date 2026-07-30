import { prisma } from '../../../../shared/infra/database/prisma.js';
import { IClientRepository } from '../../domain/IClientRepository.js';
import { IClient } from '../../domain/Client.js';
import { IUpdateClientDTO } from '../../application/dtos/IUpdateClientDTO.js';

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

  async update(paramsId: string, data: IUpdateClientDTO): Promise<IClient | null> {
    try {
      const updated = await prisma.userClient.update({
        where: { id: paramsId },
        data: { ...data },
      });
      return updated as unknown as IClient;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        String((error as Record<string, unknown>).code) === 'P2025'
      ) {
        return null;
      }
      throw error;
    }
  }

  async delete(paramsId: string): Promise<IClient | null> {
    const deleted = await prisma.userClient.delete({
      where: {
        id: paramsId,
      },
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
