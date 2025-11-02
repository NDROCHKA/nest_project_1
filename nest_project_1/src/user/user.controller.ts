import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { version } from 'os';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiOperation({ summary: 'lil gay' })

  @Get('getAll')
  findAll(): string {
    return this.userService.findAll();
  }
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'user created succsesful',
    type: CreateUserDto,
  })
  @Post('register')
  create(@Body() userDto: CreateUserDto): CreateUserDto {
    return this.userService.create(userDto);
  }
}
