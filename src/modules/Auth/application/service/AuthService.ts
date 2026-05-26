import bcrypt from 'bcrypt';
import { Result, ok, err } from '../../../../shared/types/Result.js';
import { AppError } from '../../../../shared/types/AppError.js';
import { ILoginDTO } from '../dtos/ILoginDTO.js';
import { TokenAuthUtils } from '../../utils/TokenAuthUtils.js';
import { IUserRepository } from '../../../User/domain/IUserRepository.js';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  public async login(
    data: ILoginDTO,
  ): Promise<Result<{ acessToken: string; refreshToken: string }>> {
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

  async token() {
    // Implement your create logic here
  }
}
