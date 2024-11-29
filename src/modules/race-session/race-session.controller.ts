import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RaceSessionService } from './race-session.service';
import { RaceSession } from '../../models/race-session.model';
import {RaceDriver} from "../../models/race-driver.model";
import {TimerService} from "../../timer/timer.service";

@Controller('race-sessions')
export class RaceSessionController {
    constructor(
        private readonly raceSessionService: RaceSessionService,
        private readonly timerService: TimerService,
    ) {}

    @Get()
    findAll() {
        return this.raceSessionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.raceSessionService.findOne(id);
    }


    @Post()
    create(@Body() raceSession: RaceSession) {
        return this.raceSessionService.create(raceSession);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() raceSession: RaceSession) {
        return await this.raceSessionService.update(id, raceSession);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.raceSessionService.remove(id);
    }
    @Post(':id/drivers')
    async addDriver(
        @Param('id') sessionId: number,
        @Body() driverData: { name: string; carNumber: number },
    ) {
        return this.raceSessionService.addDriverToSession(sessionId, driverData);
    }
    @Get(':id/drivers')
    async getDrivers(@Param('id') sessionId: number) {
        return this.raceSessionService.getDriversForSession(sessionId);
    }
    @Put(':id/status')
    async updateStatus(@Param('id') id: number, @Body() updateData: { status: string }) {
        return await this.raceSessionService.updateStatus(id, updateData.status);
    }
    @Put(':id/start-timer')
    startTimerForRace(@Param('id') id: number, @Body('duration') duration: number) {
        this.timerService.startTimer(duration); // Запуск таймера с переданной длительностью
        return { message: `Timer started for race session ${id}` };
    }
}
