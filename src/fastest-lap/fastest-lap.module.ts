import { Module } from '@nestjs/common';
import { FastestLapService } from './fastest-lap.service';
import { FastestLapGateway } from './fastest-lap.gateway';

@Module({
  providers: [FastestLapGateway, FastestLapService],
})
export class FastestLapModule {}
