import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default () => ({
        database: {
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT, 10) || 5432,
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'password',
                database: process.env.DB_DATABASE || 'race',
        },
});