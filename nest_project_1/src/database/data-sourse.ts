import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

loadEnv();

const nodeEnv = process.env.NODE_ENV ?? 'development';
const prefix = nodeEnv === 'test' ? 'TEST_' : '';
const url = process.env[`${prefix}DATABASE_URL`];

const dataSourceOptions: DataSourceOptions = {
  type: (process.env[`${prefix}DATABASE_TYPE`] ?? 'postgres') as any,
  ...(url
    ? { url }
    : {
        host: process.env[`${prefix}DATABASE_HOST`],
        port: parseInt(process.env[`${prefix}DATABASE_PORT`] ?? '5432', 10),
        username: process.env[`${prefix}DATABASE_USERNAME`],
        password: process.env[`${prefix}DATABASE_PASSWORD`],
        database: process.env[`${prefix}DATABASE_NAME`],
      }),
  synchronize:
    (process.env[`${prefix}DATABASE_SYNCHRONIZE`] ?? 'false') === 'true',
  logging: nodeEnv !== 'production',
  entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migrations/**/*{.ts,.js}')],
  extra: {
    max: parseInt(
      process.env[`${prefix}DATABASE_MAX_CONNECTIONS`] ?? '100',
      10,
    ),
    ssl:
      (process.env[`${prefix}DATABASE_SSL_ENABLED`] ?? 'false') === 'true'
        ? {
            rejectUnauthorized:
              (process.env[`${prefix}DATABASE_REJECT_UNAUTHORIZED`] ??
                'false') === 'true',
            ca: process.env[`${prefix}DATABASE_CA`],
            key: process.env[`${prefix}DATABASE_KEY`],
            cert: process.env[`${prefix}DATABASE_CERT`],
          }
        : undefined,
  },
};

const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
export { AppDataSource, dataSourceOptions };
