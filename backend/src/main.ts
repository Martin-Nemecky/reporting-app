import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('./secrets/private.key'),
    cert: readFileSync('./secrets/selfsigned.crt'),
  };

  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
    httpsOptions,
  });
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') ?? 8080);
}
bootstrap();
