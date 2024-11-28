import { PartialType } from '@nestjs/mapped-types';
import { CreateFastestLapDto } from './create-fastest-lap.dto';

export class UpdateFastestLapDto extends PartialType(CreateFastestLapDto) {
  id: number;
}
