import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RaceDriverService } from './race-driver.service';
import { RaceDriver } from '../../models/race-driver.model';

@Controller('race-drivers')
export class RaceDriverController {
    constructor(private readonly raceDriverService: RaceDriverService) {}

    @Get()
    findAll() {
        return this.raceDriverService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.raceDriverService.findOne(id);
    }

    @Post()
    create(@Body() raceDriver: RaceDriver) {
        return this.raceDriverService.create(raceDriver);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() raceDriver: RaceDriver) {
        return this.raceDriverService.update(id, raceDriver);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.raceDriverService.remove(id);
    }
}
