import { Injectable } from '@nestjs/common';
import { CreateFastestLapDto } from './dto/create-fastest-lap.dto';
import { FastestLap } from './entities/fastest-lap.entity';

@Injectable()
export class FastestLapService {
  fastestLap: FastestLap[] = [
    { id: 1, driverName: 'Tim', fastestLap: '00:01' },
  ];

  create(createFastestLapDto: CreateFastestLapDto) {
    const fastLap = { ...createFastestLapDto };
    this.fastestLap.push(fastLap);
    return fastLap;
  }

  findAllFastLaps() {
    return this.fastestLap;
  }
}
