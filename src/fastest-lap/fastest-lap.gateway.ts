// fastest-lap.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { FastestLapService } from './fastest-lap.service';
import { CreateFastestLapDto } from './dto/create-fastest-lap.dto';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: '/fast',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class FastestLapGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly fastestLapService: FastestLapService) {}

  @SubscribeMessage('createFastestLap')
  async create(@MessageBody() createFastestLapDto: CreateFastestLapDto) {
    // Логика обработки fastest lap
    const fastLap = await this.fastestLapService.create(createFastestLapDto);

    // Эмитируем fastTime обратно на фронт
    this.server.emit('fastTime', fastLap);

    return fastLap;
  }

  @SubscribeMessage('createLapData')
  async handleLapData(
    @MessageBody() data: { fastestLapsData: any[]; passingLapData: any[] },
  ) {
    // Обрабатываем данные, которые пришли с фронта

    console.log('Received fastestLapsData:', data.fastestLapsData);
    console.log('Received passingLapData:', data.passingLapData);

    // Эмитируем их обратно на фронт с подтверждением
    this.server.emit('lapDataResponse', {
      message: 'OK',
      fastestLapsData: data.fastestLapsData,
      passingLapData: data.passingLapData,
    });

    return {
      message: 'OK',
      fastestLapsData: data.fastestLapsData,
      passingLapData: data.passingLapData,
    };
  }
}
