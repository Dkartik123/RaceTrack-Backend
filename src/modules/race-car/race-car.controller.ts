import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RaceCarService } from './race-car.service';
import { RaceCar } from '../../models/race-car.model';

@Controller('race-cars')
export class RaceCarController {
    constructor(private readonly raceCarService: RaceCarService) {}

    @Get()
    findAll() {
        return this.raceCarService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.raceCarService.findOne(id);
    }

    @Post()
    create(@Body() raceCar: RaceCar) {
        return this.raceCarService.create(raceCar);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() raceCar: RaceCar) {
        return this.raceCarService.update(id, raceCar);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.raceCarService.remove(id);
    }
}
