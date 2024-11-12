// dto/login.dto.ts
import { IsString, IsIn } from 'class-validator';

export class LoginDto {
    @IsString()
    token: string;

    @IsString()
    @IsIn(['receptionist', 'security_officer', 'race_observer'])
    type: string;
}
