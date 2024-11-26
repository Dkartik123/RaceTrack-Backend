// timer.module.ts
import { Module } from '@nestjs/common';
import { TimerGateway } from './timer/timer.gateway';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';

@Module({
  providers: [TimerGateway, TimerService],
  exports: [TimerService],
  controllers: [TimerController], // Добавлено
})
export class TimerModule {}
