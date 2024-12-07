import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { TimerGateway } from './timer/timer.gateway';

@Injectable()
export class TimerService {
  private interval: NodeJS.Timeout | null = null;
  private saveStateInterval: NodeJS.Timeout | null = null;
  private remainingSeconds: number = 0;
  private readonly logger = new Logger(TimerService.name);
  private readonly STATE_FILE = 'timer-state.json';

  constructor(private readonly gateway: TimerGateway) {
    // Восстанавливаем состояние таймера при запуске
    this.restoreTimerState();
  }

  private saveTimerState() {
    const state = {
      remainingSeconds: this.remainingSeconds,
      isRunning: !!this.interval
    };
    try {
      fs.writeFileSync(this.STATE_FILE, JSON.stringify(state));
      this.logger.debug('Timer state saved:', state);
    } catch (error) {
      this.logger.error('Failed to save timer state:', error);
    }
  }

  private startSaveStateInterval() {
    if (this.saveStateInterval) {
      clearInterval(this.saveStateInterval);
    }

    this.saveStateInterval = setInterval(() => {
      this.saveTimerState();
    }, 2000);
  }

  private stopSaveStateInterval() {
    if (this.saveStateInterval) {
      clearInterval(this.saveStateInterval);
      this.saveStateInterval = null;
    }
  }

  private restoreTimerState() {
    try {
      if (fs.existsSync(this.STATE_FILE)) {
        const state = JSON.parse(fs.readFileSync(this.STATE_FILE, 'utf8'));
        
        if (state.isRunning && state.remainingSeconds > 0) {
          // Просто восстанавливаем оставшееся время
          this.remainingSeconds = state.remainingSeconds;
          
          // Запускаем таймер с сохраненным временем
          this.startTimer(false);
          this.logger.log(`Timer restored with ${this.remainingSeconds} seconds remaining`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to restore timer state:', error);
    }
  }

  startTimer(resetTime: boolean = true) {
    if (this.interval) {
      this.logger.warn('Timer is already running');
      return;
    }

    if (resetTime) {
      const durationMinutes = parseInt(process.env.TIMER_DURATION) || 1;
      this.remainingSeconds = durationMinutes * 60;
    }

    this.interval = setInterval(() => {
      if (this.remainingSeconds <= 0) {
        this.stopTimer();
        this.gateway.broadcastMessage('Timer finished');
        return;
      }

      const formattedTime = new Date(this.remainingSeconds * 1000)
        .toISOString()
        .substr(14, 5);
      this.gateway.server.emit('timeUpdate', formattedTime);
      this.remainingSeconds--;
    }, 1000);

    // Запускаем интервал сохранения состояния
    this.startSaveStateInterval();
    this.logger.log(`Timer started with ${this.remainingSeconds} seconds remaining`);
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      
      this.stopSaveStateInterval();
      this.saveTimerState();
      this.logger.log('Timer stopped');
    }
  }

  getCurrentTime(): string {
    return new Date(this.remainingSeconds * 1000).toISOString().substr(14, 5);
  }
}