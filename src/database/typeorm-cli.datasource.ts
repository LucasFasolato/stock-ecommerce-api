import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { validateEnv } from '../config/env.schema';

const env = validateEnv(process.env);

export default new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  synchronize: false,
  logging: true,

  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
});
