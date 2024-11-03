import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './entities/types';
import { Profile } from 'src/users/entities/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneUser(username);
    if (user.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload: UserPayload = { id: user.id, username: user.username };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async getProfile(userPayload: UserPayload): Promise<Profile> {
    const user = await this.usersService.findOneUser(userPayload.username);
    return this.usersService.convertToProfile(user);
  }
}
