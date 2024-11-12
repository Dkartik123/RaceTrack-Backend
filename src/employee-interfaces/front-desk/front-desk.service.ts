import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaceSession } from '../../models/race-session.model';
import { RaceDriver } from '../../models/race-driver.model';

@Injectable()
export class FrontDeskService {
    constructor(
        @InjectRepository(RaceSession)
        private readonly raceSessionRepository: Repository<RaceSession>,
        @InjectRepository(RaceDriver)
        private readonly raceDriverRepository: Repository<RaceDriver>,
    ) {}

    findAllSessions(): Promise<RaceSession[]> {
        return this.raceSessionRepository.find({ relations: ['drivers'] });
    }

    createSession(raceSession: RaceSession): Promise<RaceSession> {
        return this.raceSessionRepository.save(raceSession);
    }

    async assignDriverToSession(
        sessionId: number,
        driver: RaceDriver,
    ): Promise<RaceDriver> {
        const session = await this.raceSessionRepository.findOneBy({ id: sessionId });
        if (session) {
            driver.session = session;
            return this.raceDriverRepository.save(driver);
        }
        throw new Error('Session not found');
    }

    removeSession(id: number): Promise<void> {
        return this.raceSessionRepository.delete(id).then(() => {});
    }
}
