import { Controller, Get, HttpException, HttpStatus, Param, Put } from '@nestjs/common';
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

    @Get('current-race')
    async getCurrentRace() {
        try {
            const currentRace = await this.raceControlService.getCurrentRace();
            return {
                success: true,
                data: {
                    sessionId: currentRace?.id || "Unknown",
                    sessionName: currentRace?.sessionName || "No active race",
                    status: currentRace?.status || "No data",
                    flag: currentRace?.currentFlag || "Safe"
                }
            };
        } catch (error) {
            return {
                success: false,
                error: "Failed to fetch current race"
            };
        }
    }

    @Controller('race-sessions')
    export class RaceControlController {
        constructor(private readonly raceControlService: RaceControlService) {}

        @Get('current')
        async getCurrentActiveRace() {
            try {
                const currentRace = await this.raceControlService.getCurrentRace();
                if (currentRace) {
                    return currentRace;
                }
                return {
                    id: "Unknown",
                    sessionName: "No active race",
                    status: "No data",
                    currentFlag: "Safe"
                };
            } catch (error) {
                console.error("Error fetching current race:", error);
                throw new HttpException(
                    'Failed to fetch current race',
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }
    }
}
