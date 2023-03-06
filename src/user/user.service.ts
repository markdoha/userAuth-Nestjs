import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Iuser } from '../interfaces/user.interface';
import { UpdateDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async deleteUser(
    id: string,
  ): Promise<{ message: string; deleted: string } | { message: string }> {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const user = await this.userModel.findById({ _id: id });
      if (!user) {
        throw new UnauthorizedException('invalid id');
      }
      const del = await this.userModel.findByIdAndDelete({ _id: id });
      return { message: 'user deleted', deleted: del.username };
    }
    return { message: 'invalid id' };
  }

  async getUser(id: string): Promise<{ user: Iuser }> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    return { user: user };
  }

  async updateUser(
    id: string,
    updateDto: UpdateDto,
  ): Promise<{ message: string; updated: Iuser }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    if (updateDto.username) {
      user.username = updateDto.username;
    }
    if (updateDto.password) {
      user.password = await bcrypt.hash(
        updateDto.password + process.env.SECRET,
        10,
      );
    }
    if (updateDto.email) {
      user.email = updateDto.email;
    }

    const updated = await user.save();
    return { message: 'user updated', updated: updated };
  }
}
