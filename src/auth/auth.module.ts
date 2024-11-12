import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    controllers: [AuthController], // Register AuthController
    providers: [AuthService],      // Register AuthService as a provider
    exports: [AuthService],        // Export AuthService if needed elsewhere
})
export class AuthModule {}
