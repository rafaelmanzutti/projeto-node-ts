import { randomUUID } from 'crypto';
import { ICreateClientDTO } from '../dtos/ICreateClientDTO.js';
import { IUserRepository } from '../../../User/domain/IUserRepository.js';
import { IClientRepository } from '../../domain/IClientRepository.js';
import { Result, ok, err } from '../../../../shared/types/Result.js';
import { AppError } from '../../../../shared/types/AppError.js';
import { IClient } from '../../domain/Client.js';
import { IStorageRepository } from '../../../../shared/types/IStorageRepository.js';
import { IClientsPageDTO } from '../dtos/IClientsPageDTO.js';
import { IUpdateClientDTO } from '../dtos/IUpdateClientDTO.js';

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

  public async listAll(userId: string, page: number): Promise<Result<IClientsPageDTO>> {
    const pageSize = 11;
    const skip = (page - 1) * pageSize;

    try {
      const [totalCount, clients] = await Promise.all([
        this.clientRepository.count(userId),
        this.clientRepository.listByUserId(userId, skip, pageSize),
      ]);

      if (totalCount === 0) {
        return ok({ page: 1, pageSize, totalCount: 0, totalPages: 0, clients: [] });
      }

      const totalPages = Math.ceil(totalCount / pageSize);
      if (page > totalPages) return err(new AppError('Página não encontrada.', 404));

      return ok({ page, pageSize, totalCount, totalPages, clients });
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      return err(new AppError('Erro interno ao listar clientes.', 500));
    }
  }

  public async update(
    paramsId: string,
    userId: string,
    data: IUpdateClientDTO,
  ): Promise<Result<IClient>> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) return err(new AppError('Dados não encontrados.', 404));

    const existingClient = await this.clientRepository.findByIdUserId(paramsId, userId);
    if (!existingClient) return err(new AppError('Dados não encontrados.', 404));

    const toUpdate: Partial<IClient> = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      updatedAt: new Date(),
    };

    try {
      const updated = await this.clientRepository.update(paramsId, toUpdate);
      if (!updated) return err(new AppError('Dados não encontrados.', 404));
      return ok(updated);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      return err(new AppError('Erro interno ao atualizar cliente.', 500));
    }
  }

  public async delete(
    paramsId: string,
    userId: string,
  ): Promise<Result<Pick<IClient, 'id' | 'name' | 'email'>>> {
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) return err(new AppError('Dados não encontrados.', 404));

    const existingClient = await this.clientRepository.findByIdUserId(paramsId, userId);
    if (!existingClient) return err(new AppError('Dados não encontrados.', 404));

    if (!this.fileStorage.existsFolder([userId])) {
      return err(new AppError('Pasta do usuário não encontrada.', 500)); // interno
    }

    if (this.fileStorage.existsFolder([userId, paramsId])) {
      try {
        this.fileStorage.deleteFolder([userId, paramsId]);
      } catch (error) {
        console.error('Falha ao deletar pasta do cliente:', error);
        return err(new AppError('Erro ao tentar deletar arquivos do cliente.', 500));
      }
    }

    try {
      const deleted = await this.clientRepository.delete(paramsId);
      return ok(deleted!);
    } catch (error) {
      console.error('Falha ao deletar cliente do DB:', error);
      return err(new AppError('Erro ao tentar deletar.', 500));
    }
  }
}
