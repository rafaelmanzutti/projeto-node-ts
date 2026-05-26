import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Result, ok, err } from '../../../../shared/types/Result.js';
import { env } from '../../../../shared/config/env.js';
import { AppError } from '../../../../shared/types/AppError.js';
import { ILoginDTO } from '../dtos/ILoginDTO.js';
import { TokenAuthUtils } from '../../utils/TokenAuthUtils.js';
import { IUserRepository } from '../../../User/domain/IUserRepository.js';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  public async login(
    data: ILoginDTO,
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    const existingUser = await this.userRepository.findByEmailWithPassword(data.email);
    if (!existingUser) {
      return err(new AppError('Dados não encontrados.', 404));
    }
    if (!bcrypt.compareSync(data.password, existingUser.password)) {
      return err(new AppError('Credenciais inválidas.', 401));
    }
    try {
      const tokens = await TokenAuthUtils.jwtGenerate({
        id: existingUser.id,
        name: existingUser.name ?? null,
        email: existingUser.email,
      });
      return ok(tokens);
    } catch {
      return err(new AppError('Erro ao gerar token.', 500));
    }
  }

  async token(
    refreshToken: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
        payload: { id: string };
      };

      const user = await this.userRepository.findById(decoded.payload.id);
      if (!user) {
        return err(new AppError('Usuário não encontrado.', 404));
      }

      const tokens = await TokenAuthUtils.jwtGenerate({
        id: user.id,
        name: user.name ?? null,
        email: user.email,
      });
      return ok(tokens);
    } catch {
      return err(new AppError('Token inválido ou expirado.', 401));
    }
  }
}
