import { Test, TestingModule } from '@nestjs/testing';
import { TimerGateway } from './timer.gateway';

describe('TimerGateway', () => {
  let gateway: TimerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimerGateway],
    }).compile();

    gateway = module.get<TimerGateway>(TimerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
