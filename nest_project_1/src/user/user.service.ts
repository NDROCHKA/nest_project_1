import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { promises } from 'dns';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { retryWhen } from 'rxjs';
import { updateUserDto } from './dto/update-user-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException(
        `user with email ${createUserDto.email} already exists`,
      );
    }
    const entity = this.userRepository.create(createUserDto);
    return this.userRepository.save(entity);
  }

  findAll(): string {
    return 'this is return of service from user.service';
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async update(id: number, updateUserDto: updateUserDto): Promise<User>;
}
