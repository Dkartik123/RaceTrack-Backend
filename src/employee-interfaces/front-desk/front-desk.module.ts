import { Module } from '@nestjs/common';
import { FrontDeskService } from './front-desk.service';
import { FrontDeskController } from './front-desk.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RaceSession } from '../../models/race-session.model';
import { RaceDriver } from '../../models/race-driver.model';

@Module({
    imports: [TypeOrmModule.forFeature([RaceSession, RaceDriver])],
    controllers: [FrontDeskController],
    providers: [FrontDeskService],
})
export class FrontDeskModule {}