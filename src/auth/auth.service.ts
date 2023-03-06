import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';
import { Iuser } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ message: string; token: string }> {
    const { username, email, password, address } = signUpDto;
    const check = await this.userModel.findOne({ email });

    if (check) {
      throw new UnauthorizedException(
        'this email has an account you can head to login',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      addresses: [{ addressId: 1, address: address }],
    });
    const token = this.jwtService.sign({ id: user._id });
    return { message: 'account created succefully', token };
  }

  async signIn(
    logInDto: LogInDto,
  ): Promise<{ message: string; token: string }> {
    const { email, password } = logInDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid password');
    }

    const token = this.jwtService.sign(
      { id: user._id },
      { secret: process.env.JWT_SECRET },
    );
    return { message: 'login successful', token: token };
  }

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
}
