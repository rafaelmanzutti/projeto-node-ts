import { randomUUID } from 'crypto';
import { hash } from 'bcrypt';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO.js';
import { IUserRepository } from '../../domain/IUserRepository.js';
import { IUser } from '../../domain/User.js';
import { UtilsFileUser } from '../../utils/utils-file.js';
import { Result, ok, err } from '../../../../shared/types/Result.js';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  public async create(data: ICreateUserDTO): Promise<Result<IUser>> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      return err(new Error('E-mail já cadastrado.'));
    }

    const hashedPassword = await hash(data.password, 10);
    const now = new Date();
    const user: IUser = {
      id: randomUUID(),
      name: data.name ?? null,
      email: data.email,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };
    try {
      const created = await this.userRepository.create(user);
      UtilsFileUser.createFolderUser(created.id);
      return ok(created);
    } catch {
      return err(new Error('Erro ao tentar criar usuário.'));
    }
  }

  public async read(paramsId: string): Promise<IUser | null> {
    return this.userRepository.findById(paramsId);
  }

  public async update(paramsId: string, name: string): Promise<Result<IUser>> {
    const existingUser = await this.userRepository.findById(paramsId);
    if (!existingUser) {
      return err(new Error('Dados não encontrados.'));
    }
    try {
      const updated = await this.userRepository.update(paramsId, name);
      return ok(updated);
    } catch {
      return err(new Error('Erro ao tentar atualizar usuário.'));
    }
  }

  public async delete(paramsId: string): Promise<Result<void>> {
    const existingUser = await this.userRepository.findById(paramsId);
    if (!existingUser) {
      return err(new Error('Usuário não encontrado.'));
    }

    if (!UtilsFileUser.existsFolderUser(paramsId)) {
      return err(new Error('INTERNAL: Pasta do usuário não encontrada.')); // culpa do sistema → 500
    }

    try {
      UtilsFileUser.deleteFolderUser(paramsId);
      await this.userRepository.delete(paramsId);
    } catch {
      return err(new Error('Erro ao tentar deletar usuário.'));
    }

    return ok(undefined);
  }
}
