import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaceSession } from '../../models/race-session.model';

@Injectable()
export class RaceControlService {
    constructor(
        @InjectRepository(RaceSession)
        private readonly raceSessionRepository: Repository<RaceSession>,
    ) {}

    async startRace(sessionId: number): Promise<void> {
        const session = await this.raceSessionRepository.findOneBy({ id: sessionId });
        if (session) {
            session.status = 'In Progress';
            await this.raceSessionRepository.save(session);
        } else {
            throw new Error('Session not found');
        }
    }

    async finishRace(sessionId: number): Promise<void> {
        const session = await this.raceSessionRepository.findOneBy({ id: sessionId });
        if (session) {
            session.status = 'Finished';
            await this.raceSessionRepository.save(session);
        } else {
            throw new Error('Session not found');
        }
    }

    async changeRaceMode(sessionId: number, mode: string): Promise<void> {
        const session = await this.raceSessionRepository.findOneBy({ id: sessionId });
        if (session) {
            session.status = mode;
            await this.raceSessionRepository.save(session);
        } else {
            throw new Error('Session not found');
        }
    }

    async getCurrentRace() {
        return await this.raceSessionRepository.findOne({
            where: { status: 'InProgress' }
        });
    }
}
