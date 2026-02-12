import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCreateUser } from './swagger/createUser.swagger';
import { User } from './entities/user.entity';
import { parse } from 'path';
import { promises } from 'dns';
import { updateUserDto } from './dto/update-user-dto';

@ApiTags('user')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private userService: UserService) {}
  @ApiCreateUser()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: updateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }
}
