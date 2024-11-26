import { Controller, Post, Body } from '@nestjs/common';
import { TimerService } from './timer.service';

@Controller('timer')
export class TimerController {
    constructor(private readonly timerService: TimerService) {}

    @Post('start')
    startTimer(@Body('duration') duration: number) {
        this.timerService.startTimer(duration);
        return { message: `Timer started for ${duration} minute(s)` };
    }

    @Post('stop')
    stopTimer() {
        this.timerService.stopTimer();
        return { message: 'Timer stopped' };
    }
}