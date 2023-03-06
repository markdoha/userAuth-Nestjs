import { Controller } from '@nestjs/common';
import { Post, Body, Param, Get, Delete } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Get('/:id')
  async getUserAddresses(@Param('id') id: string) {
    return this.addressService.getUserAdresses(id);
  }

  @Post('/:id')
  async addAddress(@Param('id') id: string, @Body('address') address: string) {
    return this.addressService.addAddress(id, address);
  }

  @Delete('/:id')
  async deleteAddress(
    @Param('id') id: string,
    @Body('addressId') addressId: number,
  ) {
    return this.addressService.deleteAddress(id, addressId);
  }
}
