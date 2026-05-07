import { ICreateUserDTO, IUserRepository } from '../../domain/IUserRepository.js';
import { IUser } from '../../domain/User.js';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: ICreateUserDTO): Promise<IUser> {
    return this.userRepository.create(data);
  }
}
