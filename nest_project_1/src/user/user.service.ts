import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  findAll(): string {
    return 'this is return of service from user.service';
  }

  create(userDto: CreateUserDto): CreateUserDto {
    return userDto;
  }
}