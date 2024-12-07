import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../config/database.config'; // Конфигурация базы данных

// Модули приложения
import { AuthModule } from './auth/auth.module';
import { FrontDeskModule } from './employee-interfaces/front-desk/front-desk.module';
import { LapLineTrackerModule } from './employee-interfaces/lap-line-tracker/lap-line-tracker.module';
import { RaceControlModule } from './employee-interfaces/race-control/race-control.module';
import { LapTimeModule } from './modules/lap-time/lap-time.module';
import { RaceCarModule } from './modules/race-car/race-car.module';
import { RaceDriverModule } from './modules/race-driver/race-driver.module';
import { RaceSessionModule } from './modules/race-session/race-session.module';
import { TimerModule } from './timer/timer.module'; // Модуль таймера

// Провайдеры и гейтвеи
import { AuthController } from "./auth/auth.controller";
import { FastestLapModule } from './fastest-lap/fastest-lap.module';
import { RaceGateway } from './gateways/race.gateway';

@Module({
  imports: [
    // Конфигурация приложения
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // Настройка TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');

        console.log('Database connection parameters:', {
          database: dbConfig?.database || 'Not specified',
        });

        return {
          type: 'sqlite', // Использование SQLite
          database: dbConfig.database,
          autoLoadEntities: true, // Автоматическая загрузка сущностей
          synchronize: true, // Синхронизация структуры базы данных (не использовать в продакшене)
        };
      },
    }),

    // Основные модули приложения
    RaceSessionModule,
    RaceDriverModule,
    RaceCarModule,
    LapTimeModule,

    // Модули интерфейсов сотрудников
    FrontDeskModule,
    RaceControlModule,
    LapLineTrackerModule,

    // Модули функциональности
    AuthModule,
    TimerModule,
    FastestLapModule, // Таймер для работы с WebSocket
  ],
  controllers: [
    AuthController, // Контроллер аутентификации
  ],
  providers: [
    RaceGateway, // WebSocket Gateway для управления гонками
  ],
})
export class AppModule {}
