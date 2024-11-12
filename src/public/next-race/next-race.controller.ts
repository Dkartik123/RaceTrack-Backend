import { Controller, Get } from '@nestjs/common';
import { RaceSessionService } from '../../modules/race-session/race-session.service';
import { RaceDriverService } from '../../modules/race-driver/race-driver.service';

@Controller('next-race')
export class NextRaceController {
    constructor(
        private readonly raceSessionService: RaceSessionService,
        private readonly raceDriverService: RaceDriverService,
    ) {}

    @Get()
    async getNextRace() {
        // Получаем список всех сессий
        const sessions = await this.raceSessionService.findAll();

        // Находим следующую сессию, которая еще не началась
        const nextSession = sessions.find((session) => session.status === 'Pending');

        if (!nextSession) {
            return { message: 'No upcoming race sessions available at the moment' };
        }

        // Получаем всех гонщиков, которые будут участвовать в следующей сессии
        const drivers = await this.raceDriverService.findAll();
        const driversInNextSession = drivers.filter(driver => driver.session?.id === nextSession.id);

        // Формируем информацию о следующей гонке
        const nextRaceInfo = {
            sessionId: nextSession.id,
            sessionName: nextSession.sessionName,
            startTime: nextSession.startTime,
            drivers: driversInNextSession.map(driver => ({
                driverName: driver.name,
                carNumber: driver.carNumber,
            })),
        };

        return nextRaceInfo;
    }
}
