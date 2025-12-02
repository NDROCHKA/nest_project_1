import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger(DatabaseModule.name);
        const uri = configService.getOrThrow<string>('MONGODB_URI');
        const dbName = configService.get<string>('MONGODB_DB_NAME');

        return {
          uri,
          ...(dbName ? { dbName } : {}),
          autoIndex: configService.get<string>('NODE_ENV') !== 'production',
          serverSelectionTimeoutMS: 5000,
          connectionFactory: (connection) => {
            connection.once('open', () =>
              logger.log('MongoDB connection established'),
            );
            connection.on('error', (error) =>
              logger.error(
                `MongoDB connection error: ${error?.message ?? error},`
              ),
            );
            connection.on('disconnected', () =>
              logger.warn('MongoDB connection lost'),
            );
            return connection;
          },
        };
      },
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}