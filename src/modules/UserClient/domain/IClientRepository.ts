import { IUpdateClientDTO } from '../application/dtos/IUpdateClientDTO.js';
import { IClient } from './Client.js';

export interface IClientRepository {
  create(client: IClient): Promise<IClient>;
  delete(paramsid: string): Promise<IClient | null>;
  findByIdUserId(id: string, userId: string): Promise<IClient | null>;
  count(userId: string): Promise<number>;
  listByUserId(userId: string, skip: number, take: number): Promise<IClient[]>;
  update(paramsid: string, data: IUpdateClientDTO): Promise<IClient | null>;
  //findByEmail(email: string): Promise<IUser | null>;
  //findById(id: string): Promise<IUser | null>;
  //findByEmailWithPassword(email: string): Promise<IUser | null>;
  //findByEmailWithResetSecret(email: string): Promise<IUser | null>;
}
