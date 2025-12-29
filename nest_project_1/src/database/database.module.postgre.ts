import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

type NestDataSourceOptions = DataSourceOptions & {
  autoLoadEntities?: boolean;
};

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger(DatabaseModule.name);
        const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
        const prefix = nodeEnv === 'test' ? 'TEST_' : '';
        const url = configService.get<string>(`${prefix}DATABASE_URL`);
        const type =
          (configService.get<string>(`${prefix}DATABASE_TYPE`) ??
            'postgres') as DataSourceOptions['type'];

        const host = configService.get<string>(`${prefix}DATABASE_HOST`);
        const port = parseInt(
          configService.get<string>(`${prefix}DATABASE_PORT`) ?? '5432',
          10,
        );
        const username =
          configService.get<string>(`${prefix}DATABASE_USERNAME`) ?? undefined;
        const password =
          configService.get<string>(`${prefix}DATABASE_PASSWORD`) ?? undefined;
        const database =
          configService.get<string>(`${prefix}DATABASE_NAME`) ?? undefined;

        const synchronize =
          (configService.get<string>(`${prefix}DATABASE_SYNCHRONIZE`) ??
            'false') === 'true';

        const maxConnections = parseInt(
          configService.get<string>(`${prefix}DATABASE_MAX_CONNECTIONS`) ??
            '100',
          10,
        );

        const sslEnabled =
          (configService.get<string>(`${prefix}DATABASE_SSL_ENABLED`) ??
            'false') === 'true';
        const rejectUnauthorized =
          (configService.get<string>(`${prefix}DATABASE_REJECT_UNAUTHORIZED`) ??
            'false') === 'true';

        const dataSourceOptions = {
          type,
          ...(url
            ? { url }
            : {
                host,
                port,
                username,
                password,
                database,
              }),
          synchronize,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
          logging: nodeEnv !== 'production',
          autoLoadEntities: true,
          extra: {
            max: maxConnections,
            ssl: sslEnabled
              ? {
                  rejectUnauthorized,
                  ca:
                    configService.get<string>(`${prefix}DATABASE_CA`) ??
                    undefined,
                  key:
                    configService.get<string>(`${prefix}DATABASE_KEY`) ??
                    undefined,
                  cert:
                    configService.get<string>(`${prefix}DATABASE_CERT`) ??
                    undefined,
                }
              : undefined,
          },
        } as NestDataSourceOptions;

        logger.log(
          `Initializing database connection using ${url ? 'URL' : 'credentials'}`,
        );

        return dataSourceOptions;
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
