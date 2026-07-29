import { IClient } from '../../domain/Client.js';

export interface IClientsPageDTO {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  clients: IClient[];
}
