import { Module } from '@nestjs/common';
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from '../config/database.config'; // Импорт конфигурации базы данных
import { RaceSessionModule } from './modules/race-session/race-session.module';
import { RaceDriverModule } from './modules/race-driver/race-driver.module';
import { RaceCarModule } from './modules/race-car/race-car.module';
import { LapTimeModule } from './modules/lap-time/lap-time.module';
import { FrontDeskModule } from './employee-interfaces/front-desk/front-desk.module';
import { RaceControlModule } from './employee-interfaces/race-control/race-control.module';
import { LapLineTrackerModule } from './employee-interfaces/lap-line-tracker/lap-line-tracker.module';
import { RaceGateway } from './gateways/race.gateway';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module'; // Import AuthModule
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig], // Подключаем нашу конфигурацию базы данных
    }),
    AuthModule, // Include AuthModule in imports
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions =>
          configService.get<TypeOrmModuleOptions>('database'), // Получаем параметры из конфигурации
    }),
    RaceSessionModule,
    RaceDriverModule,
    RaceCarModule,
    LapTimeModule,
    FrontDeskModule,
    RaceControlModule,
    LapLineTrackerModule,
  ],
  controllers: [AuthController],
  providers: [RaceGateway],
})
export class AppModule {}
