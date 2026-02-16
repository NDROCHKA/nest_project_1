import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCreateUser } from './swagger/createUser.swagger';
import { User } from './entities/user.entity';
import type {QueryRunner} from 'typeorm';
import { parse } from 'path';
import { promises } from 'dns';
import { updateUserDto } from './dto/update-user-dto';
import { QueryRunnerInterceptor } from 'src/utils/interceptors/queryRunner.interceptor';
import { TransactionQueryRunner } from 'src/utils/decorators/transaction-query-runner.decorator';

@ApiTags('user')
@UseInterceptors(QueryRunnerInterceptor)
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private userService: UserService) {}
  @ApiCreateUser()
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @TransactionQueryRunner() queryRunner?: QueryRunner,
  ): Promise<User> {
    return this.userService.create(createUserDto, queryRunner);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @TransactionQueryRunner() queryRunner?: QueryRunner,
  ): Promise<User> {
    return this.userService.findOne(id, queryRunner);
  }
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: updateUserDto,
    @TransactionQueryRunner() queryRunner?: QueryRunner,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto, queryRunner);
  }
}
