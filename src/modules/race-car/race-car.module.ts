import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceCar } from '../../models/race-car.model';
import { RaceCarService } from './race-car.service';
import { RaceCarController } from './race-car.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RaceCar])],
    controllers: [RaceCarController],
    providers: [RaceCarService],
})
export class RaceCarModule {}
