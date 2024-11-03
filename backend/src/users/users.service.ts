import { Injectable } from '@nestjs/common';
import { Profile, User } from './entities/types';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findOneUser(username: string): Promise<User> {
    return await this.usersRepository.findOneUser(username);
  }

  async findOneUserById(userId: string): Promise<User> {
    return await this.usersRepository.findOneUserById(userId);
  }

  convertToProfile(user: User): Profile {
    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      dateOfBirth: user.dateOfBirth,
    };
  }
}
