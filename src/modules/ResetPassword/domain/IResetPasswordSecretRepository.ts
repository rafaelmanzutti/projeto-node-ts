import { ICreateResetPasswordSecretDTO } from '../application/dtos/ICreateResetPasswordSecretDTO.js';
import { IResetPasswordSecret } from './ResetPasswordSecret.js';

export interface IResetPasswordSecretRepository {
  create(data: ICreateResetPasswordSecretDTO): Promise<IResetPasswordSecret>;
}
