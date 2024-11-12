import { Controller, Param, Put } from '@nestjs/common';
import { RaceControlService } from './race-control.service';

@Controller('race-control')
export class RaceControlController {
    constructor(private readonly raceControlService: RaceControlService) {}

    @Put('start/:sessionId')
    startRace(@Param('sessionId') sessionId: number) {
        return this.raceControlService.startRace(sessionId);
    }

    @Put('finish/:sessionId')
    finishRace(@Param('sessionId') sessionId: number) {
        return this.raceControlService.finishRace(sessionId);
    }

    @Put('mode/:sessionId/:mode')
    changeRaceMode(
        @Param('sessionId') sessionId: number,
        @Param('mode') mode: string,
    ) {
        return this.raceControlService.changeRaceMode(sessionId, mode);
    }
}
