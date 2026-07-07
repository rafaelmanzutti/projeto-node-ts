//import { IUpdateUserDTO } from '../application/dtos/IUpdateUserDTO.js';
import { IClient } from './Client.js';

export interface IClientRepository {
  create(client: IClient): Promise<IClient>;
  //update(id: string, data: IUpdateUserDTO): Promise<IUser>;
  //findByEmail(email: string): Promise<IUser | null>;
  //findById(id: string): Promise<IUser | null>;
  delete(id: string): Promise<IClient | null>;
  //findByEmailWithPassword(email: string): Promise<IUser | null>;
  //findByEmailWithResetSecret(email: string): Promise<IUser | null>;
}
