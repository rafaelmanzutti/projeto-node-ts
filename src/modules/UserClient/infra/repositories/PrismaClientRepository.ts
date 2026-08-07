import { prisma } from '../../../../shared/infra/database/prisma.js';
import { IClientRepository } from '../../domain/IClientRepository.js';
import { IClient } from '../../domain/Client.js';
import { IUpdateClientDTO } from '../../application/dtos/IUpdateClientDTO.js';
import { Prisma } from '../../../../prisma/generated/client.js';

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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async delete(paramsId: string): Promise<Pick<IClient, 'id' | 'name' | 'email'>> {
    const deleted = await prisma.userClient.delete({
      where: { id: paramsId },
      select: { id: true, name: true, email: true },
    });
    return deleted;
  }
}
