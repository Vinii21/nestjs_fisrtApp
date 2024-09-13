import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      /* 
      whitelist: true,
      Esta opción indica que cualquier propiedad que no esté definida en el DTO (Data Transfer Object) será 
      eliminada. Esto ayuda a prevenir la inyección de datos no deseados.
      */
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  await app.listen(3000);
}
bootstrap();
