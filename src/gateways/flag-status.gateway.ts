import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ namespace: '/flag-status', cors: { origin: '*' } })
export class FlagStatusGateway {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(FlagStatusGateway.name);

    // Рассылка обновлений флага всем подключенным клиентам
    broadcastFlagUpdate(sessionId: number, flag: string): void {
        const payload = { sessionId, flag };
        this.server.emit('flagUpdate', payload);
        console.log('Broadcasting flag update:', payload);
    }

    // Обработка входящих сообщений (если требуется)
    @SubscribeMessage('updateFlag')
    handleUpdateFlag(@MessageBody() data: { sessionId: number; flag: string }): void {
        this.logger.log(`Received flag update request: ${JSON.stringify(data)}`);
        this.broadcastFlagUpdate(data.sessionId, data.flag);
    }

    // Дополнительные методы для подключения и отключения клиентов (если требуется)
    handleConnection(client: Socket): void {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket): void {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
}
