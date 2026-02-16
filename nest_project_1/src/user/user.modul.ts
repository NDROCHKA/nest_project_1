import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryRunnerInterceptor } from 'src/utils/interceptors/queryRunner.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService,QueryRunnerInterceptor],
  exports: [UserService],
})
export class UserModul {}
