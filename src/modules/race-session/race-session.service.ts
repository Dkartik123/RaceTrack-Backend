import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RaceSession } from '../../models/race-session.model';
import { RaceDriver } from '../../models/race-driver.model';
import { RaceStatusGateway } from '../../gateways/race-status.gateway';
import {FlagStatusGateway} from "../../gateways/flag-status.gateway";

@Injectable()
export class RaceSessionService {
    constructor(
        @InjectRepository(RaceSession)
        private readonly raceSessionRepository: Repository<RaceSession>,
        private readonly flagStatusGateway: FlagStatusGateway,

        @InjectRepository(RaceDriver)
        private readonly raceDriverRepository: Repository<RaceDriver>,

        private readonly raceStatusGateway: RaceStatusGateway
    ) {}

    async startRace(sessionId: number): Promise<void> {
        const session = await this.raceSessionRepository.findOne({ where: { id: sessionId } });
        if (!session) {
            throw new NotFoundException('Race session not found');
        }

        session.status = 'In Progress';
        await this.raceSessionRepository.save(session);

        // Send race status update with an appropriate flag
        this.raceStatusGateway.sendRaceStatusUpdate(sessionId, 'In Progress', session.sessionName, 'Safe');
    }

    async endRace(sessionId: number): Promise<RaceSession> {
        const session = await this.raceSessionRepository.findOne({ where: { id: sessionId } });
        if (!session) {
            throw new Error('Race session not found');
        }

        // Update the status to "Finished"
        session.status = 'Finished';
        const updatedSession = await this.raceSessionRepository.save(session);

        // Pass the "Finish" flag to the gateway
        this.raceStatusGateway.sendRaceStatusUpdate(
            sessionId,
            'Finished',
            session.sessionName,
            'Finish' // Flag to indicate the race has finished
        );

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


    async updateStatus(id: number, status: string, flag: string = ''): Promise<RaceSession> {
        const raceSession = await this.raceSessionRepository.findOne({ where: { id } });
        if (!raceSession) {
            throw new NotFoundException('Race session not found');
        }

        raceSession.status = status;

        // Optionally update the flag if provided
        if (flag) {
            raceSession.currentFlag = flag;
        }

        const updatedSession = await this.raceSessionRepository.save(raceSession);

        // Pass the flag parameter to the gateway
        this.raceStatusGateway.sendRaceStatusUpdate(id, status, raceSession.sessionName, flag);

        return updatedSession;
    }

    async updateFlag(sessionId: number, newFlag: string): Promise<RaceSession> {
        const raceSession = await this.raceSessionRepository.findOne({ where: { id: sessionId } });
        if (!raceSession) {
            throw new NotFoundException(`Race session with ID ${sessionId} not found`);
        }

        raceSession.currentFlag = newFlag;
        const updatedSession = await this.raceSessionRepository.save(raceSession);

        // Отправка обновления через WebSocket
        this.flagStatusGateway.broadcastFlagUpdate(sessionId, newFlag);

        return updatedSession;
    }
    async findActiveRace(): Promise<RaceSession | null> {
        console.log('Starting findActiveRace method...');
        try {
            const activeRace = await this.raceSessionRepository.findOne({
                where: {
                    status: 'In Progress' // убедитесь, что это точно совпадает с тем, как статус записан в базе
                },
                order: {
                    id: 'DESC'
                }
            });

            console.log('Query executed. Result:', activeRace);

            // Добавим проверку на null
            if (!activeRace) {
                console.log('No active race found');
                return null;
            }

            return activeRace;
        } catch (error) {
            console.error('Error in findActiveRace:', error);
            throw error; // Пробрасываем ошибку дальше
        }
    }

}
