// config/database.config.ts
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
    'database',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost', // Добавим значение по умолчанию
        port: parseInt(process.env.DB_PORT, 10) || 5432, // Обработка порта как целого числа с дефолтным значением
        username: process.env.DB_USERNAME || 'postgres', // Значение по умолчанию для удобства разработки
        password: process.env.DB_PASSWORD || '123456',
        database: process.env.DB_NAME || 'postgres',
        autoLoadEntities: true,
        synchronize: true, // Только для разработки, в продакшн - отключите
    }),
);
