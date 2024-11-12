import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LapTime } from '../../models/lap-time.model';
import { RaceDriver } from '../../models/race-driver.model';

@Injectable()
export class LapLineTrackerService {
    constructor(
        @InjectRepository(LapTime)
        private readonly lapTimeRepository: Repository<LapTime>,
        @InjectRepository(RaceDriver)
        private readonly raceDriverRepository: Repository<RaceDriver>,
    ) {}

    async recordLapTime(driverId: number, lapTime: LapTime): Promise<LapTime> {
        const driver = await this.raceDriverRepository.findOneBy({ id: driverId });
        if (driver) {
            lapTime.driver = driver;
            return this.lapTimeRepository.save(lapTime);
        } else {
            throw new Error('Driver not found');
        }
    }
}
