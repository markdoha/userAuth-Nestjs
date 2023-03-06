import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body, Param, Get, Delete } from '@nestjs/common';
import { LogInDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  async signIn(@Body() logInDto: LogInDto): Promise<{ token: string }> {
    return this.authService.signIn(logInDto);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }
}
