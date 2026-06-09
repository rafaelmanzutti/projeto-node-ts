import { IResetPasswordSecret } from '../../ResetPassword/domain/ResetPasswordSecret.js';

//export type { IResetPasswordSecret };

export interface IUser {
  id: string;
  name?: string | null;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordSecret?: IResetPasswordSecret | null;
}
