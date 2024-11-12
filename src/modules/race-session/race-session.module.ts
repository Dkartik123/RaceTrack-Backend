import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceSessionService } from './race-session.service';
import { RaceSessionController } from './race-session.controller';
import { RaceSession } from '../../models/race-session.model';
import { RaceDriver } from '../../models/race-driver.model';

@Module({
    imports: [
        TypeOrmModule.forFeature([RaceSession, RaceDriver]), // Импорт обоих репозиториев
    ],
    controllers: [RaceSessionController],
    providers: [RaceSessionService],
    exports: [RaceSessionService],
})
export class RaceSessionModule {}
