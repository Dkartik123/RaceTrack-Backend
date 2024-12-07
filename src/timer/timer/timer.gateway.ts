// timer.gateway.ts
import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/timer' })
@Injectable()
export class TimerGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;

  private readonly logger = new Logger(TimerGateway.name);

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Метод для отправки произвольных сообщений всем клиентам
  broadcastMessage(message: string) {
    this.server.emit('message', message);
    if (message === 'Timer finished') {
      this.server.emit('timerFinished');
    }
    if (message === 'Timer stopped') {
      this.server.emit('timerStopped');
    }
    this.logger.log(`Broadcasting message: ${message}`);
  }
}
