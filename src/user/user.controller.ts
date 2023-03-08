import { Controller, UseGuards, Req } from '@nestjs/common';
import { Body, Param, Get, Delete, Put } from '@nestjs/common';
import { UpdateDto } from './dto/update.dto';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { Request } from 'express';
import { tokenI } from '../interfaces/token.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  async getMe(@Req() req: Request) {
    const user = req.user as tokenI;
    return this.userService.getUser(user.user.id);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    return this.userService.updateUser(id, updateDto);
  }
}
