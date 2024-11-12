import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LapTime } from '../../models/lap-time.model';
import { LapLineTrackerService } from './lap-line-tracker.service';
import { LapLineTrackerController } from './lap-line-tracker.controller';
import { RaceDriverModule } from '../../modules/race-driver/race-driver.module'; // Импорт RaceDriverModule

@Module({
    imports: [
        TypeOrmModule.forFeature([LapTime]),
        RaceDriverModule, // Добавляем RaceDriverModule, чтобы иметь доступ к RaceDriverRepository
    ],
    providers: [LapLineTrackerService],
    controllers: [LapLineTrackerController],
})
export class LapLineTrackerModule {}
