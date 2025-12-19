import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { promises } from 'dns';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const createUser = new this.userModel(CreateUserDto);
    return createUser.save();
  }

  findAll(): string {
    return 'this is return of service from user.service';
  }
}
