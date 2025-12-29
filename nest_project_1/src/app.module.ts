import { Module } from '@nestjs/common';
import { UserModel } from './user/user.modul';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { DatabaseModule } from './database/database.module.postgre';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      //       validationSchema: Joi.object({
      //         MONGODB_URI:Joi.string().uri().required(),
      // MONGODB_DB_NAME: Joi.string().optional(),

      // }),
    }),
    DatabaseModule,
    UserModel,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
