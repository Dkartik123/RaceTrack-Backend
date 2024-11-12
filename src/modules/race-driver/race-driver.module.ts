import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceDriver } from '../../models/race-driver.model';
import { RaceDriverService } from './race-driver.service';
import { RaceDriverController } from './race-driver.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RaceDriver])],
    providers: [RaceDriverService],
    controllers: [RaceDriverController],
    exports: [TypeOrmModule, RaceDriverService], // Экспортируем TypeOrmModule и RaceDriverService
})
export class RaceDriverModule {}
