import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
    private config: ConfigService,
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

    const hashedPassword = await bcrypt.hash(password + process.env.SECRET, 10);

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

    const isPasswordValid = await bcrypt.compare(
      password + process.env.SECRET,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid password');
    }

    const token = this.jwtService.sign({ id: user._id });
    return { message: 'login successful', token: token };
  }
}
