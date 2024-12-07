// timer.module.ts
import { Module } from '@nestjs/common';
import { TimerController } from './timer.controller';
import { TimerService } from './timer.service';
import { TimerGateway } from './timer/timer.gateway';

@Module({
  providers: [TimerGateway, TimerService],
  exports: [TimerService],
  controllers: [TimerController], // Добавлено
})
export class TimerModule {}
