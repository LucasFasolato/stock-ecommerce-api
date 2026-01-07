import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Seguridad HTTP headers
  app.use(helmet());

  // Validación global (robustez de inputs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remueve props desconocidas
      forbidNonWhitelisted: true, // rompe si mandan props extra
      transform: true, // transforma tipos según DTO
    }),
  );

  const config = app.get(ConfigService);
  const port = config.get<number>('port') ?? 3000;

  await app.listen(port);
  console.log(`🚀 Listening on http://localhost:${port}`);
}
bootstrap();
