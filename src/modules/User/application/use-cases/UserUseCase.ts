import { randomUUID } from 'crypto';
import { hash } from 'bcrypt';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO.js';
import { IUserRepository } from '../../domain/IUserRepository.js';
import { IUser } from '../../domain/User.js';
import { UtilsFileUser } from '../../utils/utils-file.js';

export class UserUseCase {
  constructor(private userRepository: IUserRepository) {}

  public async create(data: ICreateUserDTO): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('E-mail já cadastrado.');
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
    const created = await this.userRepository.create(user);
    UtilsFileUser.createFolderUser(created.id);
    return created;
  }

  public async read(paramsId: string): Promise<IUser | null> {
    return this.userRepository.findById(paramsId);
  }
}
