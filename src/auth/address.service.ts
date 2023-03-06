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
      throw new UnauthorizedException('user not found');
    }
    return user.addresses;
  }

  async addAddress(
    id: string,
    address: string,
  ): Promise<{ message: string; yourAddresses: Iaddress[] }> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('user not found');
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
      throw new UnauthorizedException('user not found');
    }
    const address = user.addresses.find(
      (address) => address.addressId === addressId,
    );
    if (!address) {
      throw new UnauthorizedException('invalid address id');
    }
    await this.userModel.updateOne(
      { _id: id },
      { $pull: { addresses: { addressId: addressId } } },
    );
    const updated = await this.userModel.findById(id);
    return { message: 'address deleted', yourAddresses: updated.addresses };
  }
}
