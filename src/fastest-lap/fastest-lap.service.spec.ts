import { Test, TestingModule } from '@nestjs/testing';
import { FastestLapService } from './fastest-lap.service';

describe('FastestLapService', () => {
  let service: FastestLapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FastestLapService],
    }).compile();

    service = module.get<FastestLapService>(FastestLapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
