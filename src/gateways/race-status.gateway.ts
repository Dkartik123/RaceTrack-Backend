import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/race-status', cors: { origin: '*' } })
export class RaceStatusGateway {
    @WebSocketServer()
    server: Server;

    // Логирование подключения клиента
    handleConnection(client: Socket) {
        console.log(`Client connected to /race-status: ${client.id}`);
    }

    // Логирование отключения клиента
    handleDisconnect(client: Socket) {
        console.log(`Client disconnected from /race-status: ${client.id}`);
    }

    // Рассылка обновлений статуса гонки
    sendRaceStatusUpdate(sessionId: number, status: string, sessionName: string, flag: string) {
        const payload = { sessionId, status, sessionName, flag };
        console.log('Broadcasting raceStatusUpdate event:', payload);
        this.server.emit('raceStatusUpdate', payload); // Рассылка события всем клиентам
    }

    // Рассылка обновлений флагов
    sendFlagUpdate(sessionId: number, flag: string) {
        const payload = { sessionId, flag };
        console.log('Broadcasting flagUpdate event:', payload);
        this.server.emit('flagUpdate', payload); // Рассылка события всем клиентам
    }

    // Handle incoming race status updates
    @SubscribeMessage('updateRaceStatus')
    handleRaceStatusUpdate(@MessageBody() data: { sessionId: number; status: string; sessionName: string; flag: string }) {
        console.log('Received raceStatusUpdate:', data);
        this.sendRaceStatusUpdate(data.sessionId, data.status, data.sessionName, data.flag); // Propagate update to all clients
    }

    // Обработка обновлений флагов
    @SubscribeMessage('updateFlag')
    handleFlagUpdate(@MessageBody() data: { sessionId: number; flag: string }) {
        console.log('Received flagUpdate:', data);
        this.sendFlagUpdate(data.sessionId, data.flag); // Рассылаем обновление
    }
    @SubscribeMessage('finishRace')
    handleFinishRace(@MessageBody() data: { sessionId: number }) {
        console.log(`Race ${data.sessionId} finished.`);

        // Симуляция подготовки следующей гонки
        const nextRace = {
            id: data.sessionId + 1,
            sessionName: `Race ${data.sessionId + 1}`,
            status: 'Ready',
        };

        // Отправка обновления о завершении гонки
        this.server.emit('nextRace', nextRace);
    }
}
