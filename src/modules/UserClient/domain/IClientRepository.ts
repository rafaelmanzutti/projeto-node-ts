import { IUpdateClientDTO } from '../application/dtos/IUpdateClientDTO.js';
import { IClient } from './Client.js';

export interface IClientRepository {
  create(client: IClient): Promise<IClient>;
  delete(paramsid: string): Promise<Pick<IClient, 'id' | 'name' | 'email'>>;
  findByIdUserId(id: string, userId: string): Promise<IClient | null>;
  count(userId: string, search?: string): Promise<number>;
  listByUserId(userId: string, skip: number, take: number, search?: string): Promise<IClient[]>;
  update(paramsid: string, data: IUpdateClientDTO): Promise<IClient | null>;
}
