import { Module } from '@nestjs/common';
import { UserModel } from './user/user.modul';

@Module({
  imports: [UserModel],
  controllers: [],
  providers: [],
})
export class AppModule {}
