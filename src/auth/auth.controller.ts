// auth.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LoginDto } from './login.dto';
import { AuthService } from './auth.service';

@Controller('auth') // Префикс для всех маршрутов контроллера
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login') // Теперь маршрут будет доступен по /auth/login
    async login(@Body() loginDto: LoginDto) {
        const isValid = await this.authService.validateToken(loginDto.token, loginDto.type);

        if (isValid) {
            return { message: 'Authentication successful' };
        } else {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }
}
