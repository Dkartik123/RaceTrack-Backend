import { Module } from '@nestjs/common';
import { RaceControlService } from './race-control.service';
import { RaceControlController } from './race-control.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceSession } from '../../models/race-session.model';
import { RaceCar } from '../../models/race-car.model';

@Module({
    imports: [TypeOrmModule.forFeature([RaceSession, RaceCar])],
    controllers: [RaceControlController],
    providers: [RaceControlService],
})
export class RaceControlModule {}