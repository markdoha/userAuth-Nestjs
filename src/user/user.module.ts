import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AddressService } from './address.service';
import { UserSchema } from '../schemas/user.schema';
import { AddressController } from './address.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController, AddressController],
  providers: [UserService, AddressService],
})
export class UserModule {}
