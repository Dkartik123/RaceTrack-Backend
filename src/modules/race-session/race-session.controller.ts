import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { RaceSessionService } from './race-session.service';
import { RaceSession } from '../../models/race-session.model';
import { RaceDriver } from '../../models/race-driver.model';

@Controller('race-sessions')
export class RaceSessionController {
  constructor(private readonly raceSessionService: RaceSessionService) {}

  @Get()
  findAll() {
    return this.raceSessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.raceSessionService.findOne(id);
  }

  @Post()
  create(@Body() raceSession: RaceSession) {
    return this.raceSessionService.create(raceSession);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() raceSession: RaceSession) {
    return await this.raceSessionService.update(id, raceSession);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.raceSessionService.remove(id);
  }
}
