import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaceDriver } from '../../models/race-driver.model';

@Injectable()
export class RaceDriverService {
    constructor(
        @InjectRepository(RaceDriver)
        private readonly raceDriverRepository: Repository<RaceDriver>,
    ) {}

    async findOne(driverId: number): Promise<RaceDriver | undefined> {
        return this.raceDriverRepository.findOne({ where: { id: driverId } });
    }

    async update(driverId: number, updateData: Partial<RaceDriver>): Promise<RaceDriver> {
        await this.raceDriverRepository.update(driverId, updateData);
        return this.raceDriverRepository.findOne({ where: { id: driverId } });
    }

    async findAll(): Promise<RaceDriver[]> {
        return this.raceDriverRepository.find();
    }

    async create(raceDriver: RaceDriver): Promise<RaceDriver> {
        return this.raceDriverRepository.save(raceDriver);
    }

    async remove(id: number): Promise<void> {
        await this.raceDriverRepository.delete(id);
    }
}