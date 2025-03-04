import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource=new DataSource({
    type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'brayan',
  database: process.env.DB_NAME || 'ecommercenodets',
  synchronize: true, // ⚠️ Solo en desarrollo (cambiar a false en producción)
  logging: true,
  entities: ['src/models/*.ts'], // Directorio de modelos
  migrations: ['src/migrations/**/*.ts'],
})