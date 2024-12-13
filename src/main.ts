import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TimerService } from './timer/timer.service';

function validateEnvVariables() {
  const requiredKeys = [
    'RECEPTIONIST_TOKEN',
    'RACE_OBSERVER_TOKEN',
    'SECURITY_OFFICER_TOKEN',
    'TIMER_DURATION',
  ];

  requiredKeys.forEach((key) => {
    if (!process.env[key]) {
      console.error(`Error: Missing required environment variable: ${key}`);
      process.exit(1);
    }
  });
}

async function bootstrap() {
  validateEnvVariables();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const timerService = app.get(TimerService);
  const timerDuration = parseInt(process.env.TIMER_DURATION, 10);

  if (isNaN(timerDuration)) {
    console.error('Error: TIMER_DURATION must be a valid number');
    process.exit(1);
  }

  // timerService.startTimer(timerDuration);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

//DENIS CODE:
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { TimerService } from './timer/timer.service';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     // origin: 'http://localhost:4000', // Адрес вашего фронтенда
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,
//   });

//   // Получаем TimerService из контекста приложения
//   const timerService = app.get(TimerService);

//   // Получаем продолжительность таймера из переменной окружения
//   const timerDuration = process.env.TIMER_DURATION
//     ? parseInt(process.env.TIMER_DURATION, 10)
//     : 10; // По умолчанию 10 минут, если переменная не задана

//   // Запускаем таймер с указанной продолжительностью
//   // timerService.startTimer(timerDuration);

//   await app.listen(3000);
//   console.log(`Application is running on: ${await app.getUrl()}`);
// }
// bootstrap();
