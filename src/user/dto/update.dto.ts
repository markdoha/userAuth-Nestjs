import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password is too short' })
  password: string;
}
