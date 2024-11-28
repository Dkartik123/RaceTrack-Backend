import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/race-status', cors: { origin: '*' } })
export class RaceStatusGateway {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected to /race-status: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected from /race-status: ${client.id}`);
    }

    sendRaceStatusUpdate(sessionId: number, status: string) {
        const payload = { sessionId, status };
        console.log('Sending raceStatusUpdate event:', payload);
        this.server.emit('raceStatusUpdate', payload); // Рассылка всем клиентам в пространстве имен
    }
}