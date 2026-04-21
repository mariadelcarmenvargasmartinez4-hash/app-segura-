import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { All, ValidationPipe } from '@nestjs/common';
import { AppException } from './common/filters/http-exception.filters';
//import * as cookieParser from 'cookie-parser';
// Swagger
import helmet from 'helmet';


import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  
  // permitir CORS para el frontend 
  // const cookieParser = require('cookie-parser');
//app.use(cookieParser()); // Agregar middleware para parsear cookies
// app.use(cookieParser());
  app.enableCors({
//origin: 'http://localhost:5173',
//credentials: true,
origin: 'http://localhost:5173',
    credentials: true,
});
app.use(helmet({
    crossOriginResourcePolicy: false,
  }));

  //uso de filtros globales
  //app.useGlobalFilters(new AllExceptionfilter());
 app.useGlobalFilters(new AppException());
  // activar validaciones DTO
  app.useGlobalPipes(new ValidationPipe({whitelist: true, //  elimina campos extra
    forbidNonWhitelisted: true,}));

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
