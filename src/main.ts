import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


// esto ya esta en el main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
// configuracion de swagger
const config = new DocumentBuilder()
  .setTitle('API  con vunerabiliddaes de seguridad')
  .setDescription('Documentacion de la Api)    
  .setVersion('1.0.0')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
