import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { FrontDeskService } from './front-desk.service';
import { RaceSession } from '../../models/race-session.model';
import { RaceDriver } from '../../models/race-driver.model';

@Controller('front-desk')
export class FrontDeskController {
  constructor(private readonly frontDeskService: FrontDeskService) {}

  @Get('sessions')
  findAllSessions() {
    return this.frontDeskService.findAllSessions();
  }

  @Post('sessions')
  createSession(@Body() raceSession: RaceSession) {
    return this.frontDeskService.createSession(raceSession);
  }

  @Post('sessions/:sessionId/drivers')
  assignDriverToSession(
    @Param('sessionId') sessionId: number,
    @Body() driver: RaceDriver,
  ) {
    console.log('driver BE', driver);
    return this.frontDeskService.assignDriverToSession(sessionId, driver);
  }

  @Delete('sessions/:id')
  removeSession(@Param('id') id: number) {
    return this.frontDeskService.removeSession(id);
  }

  @Delete('sessions/:id/force')
  async removeSessionAndDrivers(@Param('id') id: number): Promise<void> {
    await this.frontDeskService.removeSessionAndDrivers(id);
  }

  // New PATCH method for partial update of a session
  @Patch('sessions/:id')
  updateSession(
    @Param('id') id: number,
    @Body() raceSession: Partial<RaceSession>, // Only fields to be updated
  ) {
    return this.frontDeskService.updateSession(id, raceSession);
  }
}
