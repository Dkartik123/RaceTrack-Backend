// auth.controller.ts
import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth') // Префикс для всех маршрутов контроллера
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login') // Теперь маршрут будет доступен по /auth/login
    async login(@Body() loginDto: LoginDto) {
        try {
            const isValid = await this.authService.validateToken(loginDto.token, loginDto.type);
            return { message: 'Authentication successful' };
        } catch (error) {
            // Добавляем задержку в 500мс при неправильной аутентификации
            await new Promise(resolve => setTimeout(resolve, 500));
            throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
        }
    }
}
