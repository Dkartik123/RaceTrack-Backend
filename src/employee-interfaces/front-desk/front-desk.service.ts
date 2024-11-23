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
    const session = await this.raceSessionRepository.findOneBy({
      id: sessionId,
    });
    if (session) {
      driver.session = session;
      return this.raceDriverRepository.save(driver);
    }
    throw new Error('Session not found');
  }

  async removeSession(id: number): Promise<void> {
    await this.raceSessionRepository.delete(id);
  }

  // New method to partially update a session
  async updateSession(
    id: number,
    updateData: Partial<RaceSession>,
  ): Promise<RaceSession> {
    const session = await this.raceSessionRepository.findOneBy({ id });

    if (!session) {
      throw new Error('Session not found');
    }

    // Apply the changes to the session object
    Object.assign(session, updateData);

    // Save the updated session
    return this.raceSessionRepository.save(session);
  }

  async removeSessionAndDrivers(sessionId: number): Promise<void> {
    const session = await this.raceSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['drivers'],
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Delete associated drivers first
    await this.raceDriverRepository.delete({ session: { id: sessionId } });

    // Delete the session itself
    await this.raceSessionRepository.delete(sessionId);
  }
}
