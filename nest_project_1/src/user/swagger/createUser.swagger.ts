import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';

export function ApiCreateUser() {
  return applyDecorators(
    ApiBody({ type: CreateUserDto }),
    ApiResponse({
      status: 201,
      description: 'user created succsesful',
      type: CreateUserDto,
    }),
    ApiOperation({ summary: 'register new user with given user schema' }),

    ApiConflictResponse({ description: 'email already exists' }),
  );
}
