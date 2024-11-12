import { Controller, Get } from '@nestjs/common';
import { RaceSessionService } from '../../modules/race-session/race-session.service';

@Controller('race-countdown')
export class RaceCountdownController {
    constructor(private readonly raceSessionService: RaceSessionService) {}

    @Get('next')
    async getRaceCountdown() {
        // Получаем список всех сессий
        const sessions = await this.raceSessionService.findAll();

        // Находим следующую сессию, которая еще не началась
        const nextSession = sessions.find((session) => session.status === 'Pending');

        if (!nextSession) {
            return { message: 'No upcoming race sessions available at the moment' };
        }

        // Рассчитываем оставшееся время до начала гонки
        const now = new Date().getTime();
        const startTime = new Date(nextSession.startTime).getTime();

        if (startTime <= now) {
            return { message: 'The next race session is starting soon' };
        }

        const timeRemaining = startTime - now;
        const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));
        const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        return {
            sessionName: nextSession.sessionName,
            startTime: nextSession.startTime,
            timeRemaining: {
                minutes: minutesRemaining,
                seconds: secondsRemaining,
            },
        };
    }
}
