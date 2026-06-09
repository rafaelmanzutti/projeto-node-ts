import { prisma } from '../../../../shared/infra/database/prisma.js';
import { ICreateResetPasswordSecretDTO } from '../../application/dtos/ICreateResetPasswordSecretDTO.js';
import { IResetPasswordSecret } from '../../domain/ResetPasswordSecret.js';
import { IResetPasswordSecretRepository } from '../../domain/IResetPasswordSecretRepository.js';

export class PrismaResetPasswordSecretRepository implements IResetPasswordSecretRepository {
  async create(data: ICreateResetPasswordSecretDTO): Promise<IResetPasswordSecret> {
    const created = await prisma.resetPasswordSecret.create({
      data: {
        id: data.id,
        secret: data.secret,
        userId: data.userId,
      },
    });
    return created;
  }
}
