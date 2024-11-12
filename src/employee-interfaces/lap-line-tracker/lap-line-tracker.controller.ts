import { Controller, Post, Body, Param } from '@nestjs/common';
import { LapLineTrackerService } from './lap-line-tracker.service';
import { LapTime } from '../../models/lap-time.model';

@Controller('lap-line-tracker')
export class LapLineTrackerController {
    constructor(private readonly lapLineTrackerService: LapLineTrackerService) {}

    @Post('record/:driverId')
    recordLapTime(
        @Param('driverId') driverId: number,
        @Body() lapTime: LapTime,
    ) {
        return this.lapLineTrackerService.recordLapTime(driverId, lapTime);
    }
}
