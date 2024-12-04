import {Controller, Get, Post} from '@nestjs/common';
import { TimerService } from './timer.service';

@Controller('timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Post('start')
  startTimer() {
    // No need to pass 'duration' in the request body, as it will be fetched from the environment variable.
    this.timerService.startTimer();
    return { message: 'Timer started' };
  }

  @Post('stop')
  stopTimer() {
    this.timerService.stopTimer();
    return { message: 'Timer stopped' };
  }
  // @Get('status')
  // getTimerStatus() {
  //   return {
  //     running: this.timerService.isRunning(),
  //     remainingTime: this.timerService.getRemainingTime(),
  //   };
  // }
}
