import { IUpdateUserDTO } from '../application/dtos/IUpdateUserDTO.js';
import { IUser } from './User.js';

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  update(id: string, data: IUpdateUserDTO): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>;
  findByEmailWithPassword(email: string): Promise<IUser | null>;
  findByEmailWithResetSecret(email: string): Promise<IUser | null>;
}
