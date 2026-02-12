import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { updateUserDto } from './dto/update-user-dto';
import {
  UserEmailAlreadyExistsException,
  UserNotFoundException,
} from './exeptions/user.exeptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}
  async create(
    createUserDto: CreateUserDto,
    queryRunner?: QueryRunner,
  ): Promise<User> {
    let isCreatedQueryRunner = false;

    if (!queryRunner) {
      queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      isCreatedQueryRunner = true;
    }
    try {
      const repository = await this.getRepository(queryRunner);

      const existing = await repository.findOne({
        where: { email: createUserDto.email },
      });
      if (existing) {
        throw new UserEmailAlreadyExistsException({
          user: createUserDto.email,
        });
      }
      const entity = this.userRepository.create(createUserDto);
      const newUser = this.userRepository.save(entity);
      if (isCreatedQueryRunner) {
        await queryRunner.commitTransaction();
      }

      return newUser;
    } catch (error) {
      if (isCreatedQueryRunner) {
        queryRunner.rollbackTransaction();
      }
      throw error;
    }
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new UserNotFoundException({ user: id });
    return user;
  }

  async update(id: number, updateUserDto: updateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email) {
      const existing = await this.userRepository.findOne({ where: { id } });

      if (existing && existing.id !== id) {
        throw new UserNotFoundException({ user: id });
      }
    }

    const merged = this.userRepository.merge(user, updateUserDto);
    return this.userRepository.save(merged);
  }

  async getRepository(queryRunner?: QueryRunner): Promise<Repository<User>> {
    if (queryRunner) {
      return queryRunner.manager.getRepository(User);
    }
    return this.userRepository;
  }
}
