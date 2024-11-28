import { Test, TestingModule } from '@nestjs/testing';
import { FastestLapGateway } from './fastest-lap.gateway';
import { FastestLapService } from './fastest-lap.service';

describe('FastestLapGateway', () => {
  let gateway: FastestLapGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FastestLapGateway, FastestLapService],
    }).compile();

    gateway = module.get<FastestLapGateway>(FastestLapGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
