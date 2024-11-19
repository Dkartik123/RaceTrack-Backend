import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (): { database: TypeOrmModuleOptions } => ({
        database: {
                type: 'sqlite',
                database: './data/beachside_racetrack.sqlite', // Укажите путь к SQLite-файлу
                entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Пути к вашим сущностям
                synchronize: true, // Используется только для разработки. В продакшене отключите!
                logging: true, // Включите для отладки
        },
});
