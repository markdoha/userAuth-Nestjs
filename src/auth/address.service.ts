import { UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { Iaddress } from './interfaces/address.interface';

export class AddressService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getUserAdresses(id: string): Promise<Iaddress[] | null> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('invalid id');
    }
    return user.addresses;
  }

  async addAddress(
    id: string,
    address: string,
  ): Promise<{ message: string; yourAddresses: Iaddress[] }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('invalid id');
    }
    if (!user.addresses.length) {
      user.addresses.push({ addressId: 1, address: address });
      await user.save();
      return { message: 'address added', yourAddresses: user.addresses };
    }
    const lastAddressId = user.addresses[user.addresses.length - 1].addressId;
    user.addresses.push({ addressId: lastAddressId + 1, address: address });
    await user.save();
    return { message: 'address added', yourAddresses: user.addresses };
  }

  async deleteAddress(
    id: string,
    addressId: number,
  ): Promise<{ message: string; yourAddresses: Iaddress[] }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('invalid id');
    }
    await this.userModel.updateOne(
      { _id: id },
      { $pull: { addresses: { addressId: addressId } } },
    );
    return { message: 'address deleted', yourAddresses: user.addresses };
  }
}
