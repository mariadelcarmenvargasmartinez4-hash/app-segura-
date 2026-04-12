import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { All, ValidationPipe } from '@nestjs/common';
import { AppException } from './common/exceptions/app.exception';
//import { AppExceptionFilter } from './common/filters/http-exception.filters';
// Swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  //uso de filtros globales
  app.useGlobalFilters(new AllExceptionfilter());

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
