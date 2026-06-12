import { randomUUID } from 'crypto';
import { AppError } from '../../../../shared/types/AppError.js';
import { Result, ok, err } from '../../../../shared/types/Result.js';
import { IUserRepository } from '../../../User/domain/IUserRepository.js';
import { IResetPasswordSecretRepository } from '../../domain/IResetPasswordSecretRepository.js';
import { IValidateUserSecretDTO } from '../dtos/IValidateUserSecretDTO.js';
//import { SendEmailUtils } from '../../utils/SendEmailUtils.js';

export class ResetPasswordService {
  constructor(
    private userRepository: IUserRepository,
    private resetPasswordSecretRepository: IResetPasswordSecretRepository,
  ) {}

  async validateUser(email: string): Promise<Result<IValidateUserSecretDTO>> {
    const existingUser = await this.userRepository.findByEmailWithResetSecret(email);
    if (!existingUser) {
      return err(new AppError('Dados não encontrados.', 404));
    }

    let secret: number;

    if (!existingUser.resetPasswordSecret) {
      const genereteSecret = Number(
        Array.from({ length: 6 }, () => Math.floor(Math.random() * 9)).join(''),
      );

      try {
        await this.resetPasswordSecretRepository.create({
          id: randomUUID(),
          secret: genereteSecret,
          userId: existingUser.id,
        });
      } catch {
        return err(new AppError('Erro ao criar código de recuperação.', 500));
      }
      secret = genereteSecret;
      //SendEmailUtils.sendEmail(existingUser.email, secret);
    } else {
      secret = existingUser.resetPasswordSecret.secret;
    }
    //SendEmailUtils.sendEmail(existingUser.email, secret);
    return ok({ email: existingUser.email, secret });
  }
  async validateSecurityCode(
    email: string,
    secret: number,
  ): Promise<Result<IValidateUserSecretDTO>> {
    const existingUser = await this.userRepository.findByEmailWithResetSecret(email);
    if (!existingUser) {
      return err(new AppError('Dados não encontrados.', 404));
    }
    if (
      !existingUser.resetPasswordSecret ||
      existingUser.resetPasswordSecret.secret !== Number(secret)
    ) {
      return err(new AppError('Código de segurança inválido.', 400));
    }
    return ok({ email: existingUser.email, secret: existingUser.resetPasswordSecret.secret });
  }
  //async resetPassword(): Promise<void> {}
}
