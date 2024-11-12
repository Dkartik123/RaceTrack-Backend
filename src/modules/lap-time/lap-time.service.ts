import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LapTime } from '../../models/lap-time.model';
import { RaceDriver } from '../../models/race-driver.model';

@Injectable()
export class LapTimeService {
    constructor(
        @InjectRepository(LapTime)
        private readonly lapTimeRepository: Repository<LapTime>,
        @InjectRepository(RaceDriver)
        private readonly raceDriverRepository: Repository<RaceDriver>,
    ) {}

    findAll(): Promise<LapTime[]> {
        return this.lapTimeRepository.find({ relations: ['driver'] });
    }

    findOne(id: number): Promise<LapTime> {
        return this.lapTimeRepository.findOne({
            where: { id },
            relations: ['driver'],
        });
    }

    async create(driverId: number, lapTime: LapTime): Promise<LapTime> {
        const driver = await this.raceDriverRepository.findOneBy({ id: driverId });
        if (driver) {
            lapTime.driver = driver;
            return this.lapTimeRepository.save(lapTime);
        } else {
            throw new Error('Driver not found');
        }
    }

    async findFastestLap(driverId: number): Promise<LapTime> {
        return this.lapTimeRepository.findOne({
            where: { driver: { id: driverId } },
            order: { time: 'ASC' },
        });
    }

    async remove(id: number): Promise<void> {
        await this.lapTimeRepository.delete(id);
    }
}
