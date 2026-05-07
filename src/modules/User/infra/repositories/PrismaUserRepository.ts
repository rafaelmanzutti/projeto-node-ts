import { prisma } from '../../../../shared/infra/database/prisma.js';
import { ICreateUserDTO, IUserRepository } from '../../domain/IUserRepository.js';
import { IUser } from '../../domain/User.js';

export class PrismaUserRepository implements IUserRepository {
  async create(data: ICreateUserDTO): Promise<IUser> {
    return prisma.user.create({ data });
  }
}
