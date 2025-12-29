import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User name ',
    example: 'jon bouzed',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'email',
    example: 'anaGay@123',
    minLength: 2,
    maxLength: 50,
  })
  @IsEmail()
  email: string;

  @IsNumber()
  age: number;
}
