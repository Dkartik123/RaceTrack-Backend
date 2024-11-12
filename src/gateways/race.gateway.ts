import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RaceSessionService } from '../modules/race-session/race-session.service';
import { RaceDriverService } from '../modules/race-driver/race-driver.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*', // В реальном приложении следует ограничить этот список определенными доменами.
    },
})
export class RaceGateway {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger('RaceGateway');

    constructor(
        private readonly raceSessionService: RaceSessionService,
        private readonly raceDriverService: RaceDriverService,
    ) {}

    @SubscribeMessage('startRace')
    async handleStartRace(@MessageBody() sessionId: number) {
        await this.handleRaceAction(sessionId, 'In Progress', async () => {
            await this.raceSessionService.startRace(sessionId);
        });
    }

    @SubscribeMessage('finishRace')
    async handleFinishRace(@MessageBody() sessionId: number) {
        await this.handleRaceAction(sessionId, 'Finished', async () => {
            await this.raceSessionService.endRace(sessionId);
        });
    }

    @SubscribeMessage('lapCompleted')
    async handleLapCompleted(
        @MessageBody() payload: { driverId: number; lapTime: number },
        @ConnectedSocket() client: Socket,
    ) {
        try {
            const driver = await this.raceDriverService.findOne(payload.driverId);
            if (!driver) {
                client.emit('error', { message: 'Driver not found' });
                return;
            }

            if (!driver.fastestLap || payload.lapTime < driver.fastestLap) {
                driver.fastestLap = payload.lapTime;
                await this.raceDriverService.update(driver.id, driver);
            }

            this.server.emit('lapCompleted', {
                driverId: payload.driverId,
                lapTime: payload.lapTime,
            });

            this.logger.log(
                `Driver ${payload.driverId} completed a lap with time ${payload.lapTime}`,
            );
        } catch (error) {
            this.logger.error('Error processing lap completion: ', error);
        }
    }

    @SubscribeMessage('getRaceStatus')
    async handleGetRaceStatus(@MessageBody() sessionId: number, @ConnectedSocket() client: Socket) {
        try {
            const session = await this.raceSessionService.findOne(sessionId);
            if (session) {
                client.emit('raceStatus', { sessionId, status: session.status });
            } else {
                client.emit('error', { message: 'Race session not found' });
            }
        } catch (error) {
            this.logger.error(`Error fetching race status for session ID ${sessionId}: `, error);
        }
    }

    private async handleRaceAction(
        sessionId: number,
        status: string,
        action: () => Promise<void>,
    ) {
        try {
            await action();
            this.server.emit('raceStatus', { sessionId, status });
            this.logger.log(`Race ${sessionId} is now ${status}.`);
        } catch (error) {
            this.logger.error(`Error during race action for session ID ${sessionId}: `, error);
        }
    }
}
