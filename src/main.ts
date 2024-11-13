import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Добавлено для валидации

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включаем CORS
  app.enableCors({
    origin: ['http://localhost:4000', 'http://localhost:8080'], // Адрес вашего фронтенда
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Добавляем aDSглобальную валидацию (если требуется)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
