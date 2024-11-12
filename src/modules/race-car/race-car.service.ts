import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaceCar } from '../../models/race-car.model';

@Injectable()
export class RaceCarService {
    constructor(
        @InjectRepository(RaceCar)
        private readonly raceCarRepository: Repository<RaceCar>,
    ) {}

    findAll(): Promise<RaceCar[]> {
        return this.raceCarRepository.find();
    }

    findOne(id: number): Promise<RaceCar> {
        return this.raceCarRepository.findOneBy({ id });
    }

    create(raceCar: RaceCar): Promise<RaceCar> {
        return this.raceCarRepository.save(raceCar);
    }

    update(id: number, raceCar: RaceCar): Promise<RaceCar> {
        return this.raceCarRepository.save({ ...raceCar, id });
    }

    async remove(id: number): Promise<void> {
        await this.raceCarRepository.delete(id);
    }
}
