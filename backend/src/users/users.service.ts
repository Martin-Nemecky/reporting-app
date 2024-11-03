import { Injectable } from '@nestjs/common';
import { User } from './entities/types';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findOneUser(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOneUser(username);
  }
}
