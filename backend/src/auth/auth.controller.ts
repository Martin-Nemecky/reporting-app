import {
  Body,
  Controller,
  Post,
  Request,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/types';
import { AuthGuard, Public } from './auth.guard';
import { UserPayload } from './entities/types';
import { Profile } from 'src/users/entities/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post()
  signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(
    @Request() req: Request & { userPayload: UserPayload },
  ): Promise<Profile> {
    return await this.authService.getProfile(req.userPayload);
  }
}
