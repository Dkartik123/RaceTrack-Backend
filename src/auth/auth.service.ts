import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    // Определяем допустимые токены для каждого типа пользователя
    private readonly tokens = {
        receptionist: process.env.RECEPTIONIST_TOKEN,
        race_observer: process.env.RACE_OBSERVER_TOKEN,
        security_officer: process.env.SECURITY_OFFICER_TOKEN,
    };


    async validateToken(token: string, type: string): Promise<any> {
        // Проверяем, соответствует ли токен ожидаемому для данного типа пользователя
        const expectedToken = this.tokens[type];
        if (!expectedToken || token !== expectedToken) {
            throw new UnauthorizedException('Invalid token');
        }

        // Возвращаем результат после успешной аутентификации
        return {
            message: 'Login successful',
            type,
            token,
        };
    }
}
