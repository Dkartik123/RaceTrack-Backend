import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config'; // Конфигурация базы данных

// Модули приложения
import { RaceSessionModule } from './modules/race-session/race-session.module';
import { RaceDriverModule } from './modules/race-driver/race-driver.module';
import { RaceCarModule } from './modules/race-car/race-car.module';
import { LapTimeModule } from './modules/lap-time/lap-time.module';
import { FrontDeskModule } from './employee-interfaces/front-desk/front-desk.module';
import { RaceControlModule } from './employee-interfaces/race-control/race-control.module';
import { LapLineTrackerModule } from './employee-interfaces/lap-line-tracker/lap-line-tracker.module';
import { AuthModule } from './auth/auth.module';
import { RaceGateway } from './gateways/race.gateway';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    // Конфигурация приложения
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),

    // Настройка TypeORM с PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');

        // Вывод конфигурации для отладки
        console.log('Параметры подключения к базе данных:', {
          host: dbConfig?.host || 'Не указано',
          port: dbConfig?.port || 'Не указано',
          username: dbConfig?.username || 'Не указано',
          database: dbConfig?.database || 'Не указано',
        });

        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          autoLoadEntities: true,
          synchronize: true,
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

    // Модуль аутентификации
    AuthModule,
  ],
  controllers: [AuthController],
  providers: [RaceGateway],
})
export class AppModule {}
