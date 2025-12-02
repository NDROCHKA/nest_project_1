import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { version } from 'os';
import { ApiCreateUser } from './swagger/post.swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiOperation({ summary: 'gets all users' })
  @Get('getAll')
  findAll(): string {
    return this.userService.findAll();
  }

  @ApiCreateUser()
  @Post('register')
  create(@Body() userDto: CreateUserDto): CreateUserDto {
    return this.userService.create(userDto);
  }


  @Get(':id')
  getOne(){

  }
  
}


