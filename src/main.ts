import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // activar validaciones DTO
  app.useGlobalPipes(new ValidationPipe());

  // configuración de swagger
  const config = new DocumentBuilder()
    .setTitle('API con vulnerabilidades de seguridad')
    .setDescription('Documentación de la API')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
