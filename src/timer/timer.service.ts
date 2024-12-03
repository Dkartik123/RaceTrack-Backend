import { Injectable, Logger } from '@nestjs/common';
import { TimerGateway } from './timer/timer.gateway';

@Injectable()
export class TimerService {
  private interval: NodeJS.Timeout | null = null;
  private remainingSeconds: number = 0;
  private readonly logger = new Logger(TimerService.name);

  constructor(private readonly gateway: TimerGateway) {}

  startTimer() {
    // Get the duration from the environment variable (defaults to 1 minute if not set)
    const durationMinutes = parseInt(process.env.TIMER_DURATION) || 1;

    if (this.interval) {
      this.logger.warn('Timer is already running');
      return;
    }

    this.remainingSeconds = durationMinutes * 60;
    this.interval = setInterval(() => {
      if (this.remainingSeconds <= 0) {
        this.stopTimer();
        this.gateway.broadcastMessage('Timer finished');
        return;
      }

      const formattedTime = new Date(this.remainingSeconds * 1000)
        .toISOString()
        .substr(14, 5);
      this.logger.debug(`Emitting time update: ${formattedTime}`);
      this.gateway.server.emit('timeUpdate', formattedTime);
      this.remainingSeconds--;
    }, 1000);

    this.logger.log(`Timer started for ${durationMinutes} minute(s)`);
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.logger.log('Timer stopped');
    } else {
      this.logger.warn('No timer is running to stop');
    }
  }
}
