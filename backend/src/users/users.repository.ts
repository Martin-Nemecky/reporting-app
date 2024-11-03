import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/types';

@Injectable()
export class UsersRepository {
  private readonly users: User[] = [
    {
      id: '1',
      username: 'test',
      password: 'test', // This property should be hashed and salted in production, but for simplicity I'll leave it for now :)
      firstname: 'Martin',
      lastname: 'N',
      dateOfBirth: 1730448486182,
    },
  ];

  async findOneUser(username: string): Promise<User> {
    const foundUser = this.users.find((user) => user.username === username);

    if (foundUser == null) {
      throw new HttpException(
        `User with username: ${username} was not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return foundUser;
  }

  async findOneUserById(userId: string): Promise<User> {
    const foundUser = this.users.find((user) => user.id === userId);

    if (foundUser == null) {
      throw new HttpException(
        `User with id: ${userId} was not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return foundUser;
  }
}
