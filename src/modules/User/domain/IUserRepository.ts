import { IUser } from './User.js';

export interface IUserRepository {
  create(user: IUser): Promise<IUser>;
  update(id: string, name: string): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  delete(id: string): Promise<IUser | null>;
}
