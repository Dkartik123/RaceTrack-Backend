import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LapTime } from '../../models/lap-time.model';
import { LapTimeService } from './lap-time.service';
import { LapTimeController } from './lap-time.controller';
import { RaceDriverModule } from '../race-driver/race-driver.module'; // Импорт RaceDriverModule

@Module({
    imports: [
        TypeOrmModule.forFeature([LapTime]),
        RaceDriverModule, // Добавляем RaceDriverModule, чтобы иметь доступ к RaceDriverRepository
    ],
    providers: [LapTimeService],
    controllers: [LapTimeController],
})
export class LapTimeModule {}
