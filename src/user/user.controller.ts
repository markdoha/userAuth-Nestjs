import { Controller } from '@nestjs/common';
import { Body, Param, Get, Delete, Put } from '@nestjs/common';
import { UpdateDto } from './dto/update.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private authService: UserService) {}

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    return this.authService.deleteUser(id);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.authService.getUser(id);
  }

  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    return this.authService.updateUser(id, updateDto);
  }
}
