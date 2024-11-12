import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { LapTimeService } from './lap-time.service';
import { LapTime } from '../../models/lap-time.model';

@Controller('lap-times')
export class LapTimeController {
    constructor(private readonly lapTimeService: LapTimeService) {}

    @Get()
    findAll() {
        return this.lapTimeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.lapTimeService.findOne(id);
    }

    @Post(':driverId')
    create(
        @Param('driverId') driverId: number,
        @Body() lapTime: LapTime,
    ) {
        return this.lapTimeService.create(driverId, lapTime);
    }

    @Get('fastest/:driverId')
    findFastestLap(@Param('driverId') driverId: number) {
        return this.lapTimeService.findFastestLap(driverId);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.lapTimeService.remove(id);
    }
}
