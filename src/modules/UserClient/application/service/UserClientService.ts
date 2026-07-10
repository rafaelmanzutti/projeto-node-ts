import { randomUUID } from 'crypto';
//import { hash } from 'bcrypt';
import { ICreateClientDTO } from '../dtos/ICreateClientDTO.js';
import { IUserRepository } from '../../../User/domain/IUserRepository.js';
import { IClientRepository } from '../../domain/IClientRepository.js';
//import { IUser } from '../../domain/User.js';
import { Result, ok, err } from '../../../../shared/types/Result.js';
import { AppError } from '../../../../shared/types/AppError.js';
import { IClient } from '../../domain/Client.js';
import { IStorageRepository } from '../../../../shared/types/IStorageRepository.js';

export class UserClientService {
  constructor(
    private userRepository: IUserRepository,
    private clientRepository: IClientRepository,
    private fileStorage: IStorageRepository,
  ) {}

  public async create(data: ICreateClientDTO): Promise<Result<IClient>> {
    const existingUser = await this.userRepository.findById(data.userId);
    if (!existingUser) {
      return err(new AppError('Dados não encontrados.', 404));
    }

    const now = new Date();
    const client: IClient = {
      id: randomUUID(),
      userId: data.userId,
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      createdAt: now,
      updatedAt: now,
    };
    try {
      const created = await this.clientRepository.create(client);
      const folderCreated = this.fileStorage.createFolder([client.userId, created.id]);
      if (!folderCreated) {
        try {
          await this.clientRepository.delete(created.id);
        } catch (ignore) {
          console.error('Rollback falhou ao deletar cliente recém-criado', ignore);
        }
        return err(new AppError('Erro ao tentar criar cliente.', 500));
      }
      return ok(created);
    } catch (error) {
      console.error('erro real:', error);
      return err(new AppError('Erro ao tentar criar cliente.', 500));
    }
  }

  public async read(paramsId: string, userId: string): Promise<Result<IClient>> {
    try {
      const client = await this.clientRepository.findByIdUserId(paramsId, userId);
      if (!client) return err(new AppError('Dados não encontrados.', 404));
      return ok(client);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      return err(new AppError('Erro interno ao buscar cliente.', 500));
    }
  }

  // public async listAll(paramsId: string): Promise<IUser | null> {
  //   return this.userRepository.findById(paramsId);
  // }

  // public async update(paramsId: string, name: string): Promise<Result<IUser>> {
  //   const existingUser = await this.userRepository.findById(paramsId);
  //   if (!existingUser) {
  //     return err(new AppError('Dados não encontrados.', 404));
  //   }
  //   try {
  //     const updated = await this.userRepository.update(paramsId, { name: name });
  //     return ok(updated);
  //   } catch {
  //     return err(new AppError('Erro ao tentar atualizar.', 500));
  //   }
  // }

  // public async delete(paramsId: string): Promise<Result<void>> {
  //   const existingUser = await this.userRepository.findById(paramsId);
  //   if (!existingUser) {
  //     return err(new AppError('Usuário não encontrado.', 404));
  //   }

  //   if (!this.fileStorage.existsFolder([paramsId])) {
  //     return err(new AppError('Pasta do usuário não encontrada.', 500)); // interno
  //   }

  //   try {
  //     this.fileStorage.deleteFolder([paramsId]);
  //     await this.clientRepository.delete(paramsId);
  //   } catch {
  //     return err(new AppError('Erro ao tentar deletar.', 500)); // interno
  //   }

  //   return ok(undefined);
  // }
}
