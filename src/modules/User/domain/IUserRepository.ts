import { IUser } from './User.js';

export interface ICreateUserDTO {
  email: string;
  name?: string;
}

export interface IUserRepository {
  create(data: ICreateUserDTO): Promise<IUser>;
}
