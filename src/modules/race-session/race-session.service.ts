import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaceSession } from '../../models/race-session.model';
import { RaceDriver } from '../../models/race-driver.model';
import { RaceStatusGateway } from '../../gateways/race-status.gateway';

@Injectable()
export class RaceSessionService {
    constructor(
        @InjectRepository(RaceSession)
        private readonly raceSessionRepository: Repository<RaceSession>,

        @InjectRepository(RaceDriver)
        private readonly raceDriverRepository: Repository<RaceDriver>,

        private readonly raceStatusGateway: RaceStatusGateway
    ) {}

    async startRace(sessionId: number): Promise<RaceSession> {
        const session = await this.raceSessionRepository.findOne({ where: { id: sessionId } });
        if (!session) {
            throw new Error('Race session not found');
        }
        session.status = 'In Progress';
        const updatedSession = await this.raceSessionRepository.save(session);

        // Отправка уведомления через WebSocket
        this.raceStatusGateway.sendRaceStatusUpdate(sessionId, 'In Progress');

        return updatedSession;
    }

    async endRace(sessionId: number): Promise<RaceSession> {
        const session = await this.raceSessionRepository.findOne({ where: { id: sessionId } });
        if (!session) {
            throw new Error('Race session not found');
        }
        session.status = 'Finished';
        const updatedSession = await this.raceSessionRepository.save(session);

        // Отправка уведомления через WebSocket
        this.raceStatusGateway.sendRaceStatusUpdate(sessionId, 'Finished');

        return updatedSession;
    }

    async findOne(sessionId: number): Promise<RaceSession | undefined> {
        return this.raceSessionRepository.findOne({ where: { id: sessionId } });
    }

    async findAll(): Promise<RaceSession[]> {
        return this.raceSessionRepository.find();
    }

    async create(raceSession: RaceSession): Promise<RaceSession> {
        return this.raceSessionRepository.save(raceSession);
    }

    async update(id: number, raceSession: RaceSession): Promise<RaceSession> {
        await this.raceSessionRepository.update(id, raceSession);
        return this.raceSessionRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<void> {
        await this.raceSessionRepository.delete(id);
    }

    async addDriverToSession(sessionId: number, driverData: { name: string; carNumber: number }): Promise<RaceDriver> {
        const session = await this.raceSessionRepository.findOne({ where: { id: sessionId } });
        if (!session) throw new NotFoundException('Race session not found');

        const newDriver = this.raceDriverRepository.create({
            name: driverData.name,
            carNumber: driverData.carNumber,
            session,
        });
        return this.raceDriverRepository.save(newDriver);
    }

    // Метод для получения всех гонщиков в сессии
    async getDriversForSession(sessionId: number): Promise<RaceDriver[]> {
        const session = await this.raceSessionRepository.findOne({
            where: { id: sessionId },
            relations: ['drivers'], // Убедитесь, что включена связь с гонщиками
        });

        if (!session) {
            throw new NotFoundException(`Session with ID ${sessionId} not found`);
        }

        return session.drivers;
    }

    async updateStatus(id: number, status: string): Promise<RaceSession> {
        const raceSession = await this.raceSessionRepository.findOne({ where: { id } });
        if (!raceSession) {
            throw new NotFoundException('Race session not found');
        }

        raceSession.status = status;
        const updatedSession = await this.raceSessionRepository.save(raceSession);

        // Отправка уведомления через WebSocket
        this.raceStatusGateway.sendRaceStatusUpdate(id, status);

        return updatedSession;
    }
}
