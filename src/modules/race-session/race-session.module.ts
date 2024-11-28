import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceSessionService } from './race-session.service';
import { RaceSessionController } from './race-session.controller';
import { RaceSession } from '../../models/race-session.model';
import { RaceDriver } from '../../models/race-driver.model';
import {RaceStatusGateway} from "../../gateways/race-status.gateway";


@Module({
    imports: [
        TypeOrmModule.forFeature([RaceSession, RaceDriver]),
    ],
    controllers: [RaceSessionController],
    providers: [RaceSessionService, RaceStatusGateway],
    exports: [RaceSessionService, RaceStatusGateway],
})
export class RaceSessionModule {}