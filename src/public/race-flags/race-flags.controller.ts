import { Controller, Get, Put, Param } from '@nestjs/common';
import { RaceSessionService } from '../../modules/race-session/race-session.service';

@Controller('race-flags')
export class RaceFlagsController {
    constructor(private readonly raceSessionService: RaceSessionService) {}

    @Get(':sessionId')
    async getCurrentFlag(@Param('sessionId') sessionId: number) {
        // Получаем текущую сессию гонки
        const session = await this.raceSessionService.findOne(sessionId);
        if (!session) {
            return { message: 'Race session not found' };
        }

        return {
            sessionId: session.id,
            sessionName: session.sessionName,
            currentFlag: session.currentFlag,
        };
    }

    @Put(':sessionId/:flag')
    async setFlag(@Param('sessionId') sessionId: number, @Param('flag') flag: string) {
        // Проверяем, является ли указанный флаг допустимым
        const validFlags = ['Safe', 'Hazard', 'Danger', 'Finish'];
        if (!validFlags.includes(flag)) {
            return { message: 'Invalid flag. Valid flags are: Safe, Hazard, Danger, Finish' };
        }

        // Находим и обновляем сессию гонки
        const session = await this.raceSessionService.findOne(sessionId);
        if (!session) {
            return { message: 'Race session not found' };
        }

        session.currentFlag = flag;
        await this.raceSessionService.update(session.id, session);

        return {
            message: `Flag has been updated to ${flag}`,
            sessionId: session.id,
            currentFlag: session.currentFlag,
        };
    }
}
