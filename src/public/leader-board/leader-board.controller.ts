import { Controller, Get, Param } from '@nestjs/common';
import { RaceSessionService } from '../../modules/race-session/race-session.service';
import { RaceDriverService } from '../../modules/race-driver/race-driver.service';
import { LapTimeService } from '../../modules/lap-time/lap-time.service';

@Controller('leader-board')
export class LeaderBoardController {
    constructor(
        private readonly raceSessionService: RaceSessionService,
        private readonly raceDriverService: RaceDriverService,
        private readonly lapTimeService: LapTimeService,
    ) {}

    @Get('current/:sessionId')
    async getCurrentLeaderBoard(@Param('sessionId') sessionId: number) {
        // Находим текущую сессию гонки
        const session = await this.raceSessionService.findOne(sessionId);
        if (!session) {
            throw new Error('Race session not found');
        }

        // Получаем всех гонщиков, участвующих в текущей сессии
        const drivers = await this.raceDriverService.findAll();
        const driversInSession = drivers.filter(driver => driver.session?.id === sessionId);

        // Создаем массив данных о текущем времени каждого гонщика
        const leaderBoard = await Promise.all(
            driversInSession.map(async (driver) => {
                const fastestLap = await this.lapTimeService.findFastestLap(driver.id);
                return {
                    driverName: driver.name,
                    carNumber: driver.carNumber,
                    fastestLapTime: fastestLap ? fastestLap.time : null,
                };
            }),
        );

        // Сортируем по лучшему времени (самое короткое время круга первое)
        leaderBoard.sort((a, b) => (a.fastestLapTime || Infinity) - (b.fastestLapTime || Infinity));

        return {
            sessionName: session.sessionName,
            status: session.status,
            leaderBoard,
        };
    }
}
